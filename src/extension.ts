import * as vscode from "vscode";
import { languageMap, TLanguage } from "./constants";
import path from "path";
// @ts-ignore
const API = require("./server/server.js");

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

function getSelectedText():
  | {
      content: string;
      language: TLanguage | undefined;
    }
  | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return undefined;
  }
  const document = editor.document;
  const fileName = document.fileName;
  // 文件拓展名
  const extensionName = fileName.split(".").pop();
  const language = findLanguageByExtension(extensionName || "");
  const selection = editor.selection;
  return {
    content: editor.document.getText(selection),
    language,
  };
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
    console.log("发送代码内容:", selectedText?.content);
    console.log("代码语言为:", selectedText?.language);
    console.log("等待回复中....");
    API(selectedText?.language, selectedText?.content)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
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

// const panel = vscode.window.createWebviewPanel(
//   "sidebar_test_id1", // 唯一标识符
//   "第一小组插件作业",
//   vscode.ViewColumn.Seven, // WebView 的显示位置
//   {
//     enableScripts: true, // 允许执行 JavaScript
//   }
// );
// panel.webview.html = "<div>testtest</div>";

vscode.window.registerWebviewViewProvider(
  "sidebar_test_id1",
  {
    resolveWebviewView: (webviewView, context) => {
      // 在这里设置自定义视图的 HTML 内容、事件处理等
      webviewView.webview.html = "<h1>Hello from Webview!</h1>";
    },
  },
  {
    webviewOptions: {
      retainContextWhenHidden: true,
    },
  }
);
