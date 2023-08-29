import * as vscode from "vscode";
import { languageMap, TLanguage } from "./constants";
import path from "path";

export function findLanguageByExtension(
  extensionName: string
): TLanguage | undefined {
  for (const language in languageMap) {
    if (languageMap[language as TLanguage].includes(extensionName)) {
      return language as TLanguage;
    }
  }
  return undefined;
}

function getSelectedText(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return undefined;
  }
  const document = editor.document;
  const fileName = document.fileName;
  // 文件拓展名
  const extensionName = fileName.split(".").pop();
  console.log(findLanguageByExtension(extensionName || ""));
  const selection = editor.selection;
  return editor.document.getText(selection);
}

function getWebviewContent(srcUri: string) {
  return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>webview-react</title>
    <script defer="defer" src="${srcUri}"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
  </html>`;
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("feedContent", () => {
    // 选中文字内容
    const selectedText = getSelectedText();
    console.log(selectedText);
  });
  context.subscriptions.push(disposable);

  const isProduction =
    context.extensionMode === vscode.ExtensionMode.Production;
  let srcUrl = "";
  vscode.window.registerWebviewViewProvider(
    "sidebar_test_id1",
    {
      resolveWebviewView: (panel) => {
        panel.webview.options = { enableScripts: true };
        if (isProduction) {
          const filePath = vscode.Uri.file(
            path.join(context.extensionPath, "dist", "static/js/main.js")
          );
          srcUrl = panel.webview.asWebviewUri(filePath).toString();
        } else {
          5;
          srcUrl = "http://localhost:3000/static/js/main.js";
        }
        panel.webview.html = getWebviewContent(srcUrl);
        const updateWebview = () => {
          panel.webview.html = getWebviewContent(srcUrl);
        };
        updateWebview();
        const interval = setInterval(updateWebview, 1000);

        panel.onDidDispose(
          () => {
            clearInterval(interval);
          },
          null,
          context.subscriptions
        );
      },
    },
    {
      webviewOptions: {
        retainContextWhenHidden: true,
      },
    }
  );
}
