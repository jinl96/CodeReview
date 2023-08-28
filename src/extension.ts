import * as vscode from "vscode";
import { languageMap, TLanguage } from "./constants";

export function findLanguageByExtension(extensionName: string): TLanguage | undefined {
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

/**
 * webview 内容显示 demo
 * @param extensionUri
 * @returns
 */
function getChatboxHtml(extensionUri: vscode.Uri): string {
  return `
    <html>
        <head></head>
        <body>
            <div id="chatbox"></div>
            <textarea id="inputMessage"></textarea>
            <button id="sendMessage">Send</button>

            <script>
                const vscode = acquireVsCodeApi();
                document.getElementById('sendMessage').addEventListener('click', () => {
                    const message = document.getElementById('inputMessage').value;
                    vscode.postMessage({
                        command: 'sendMessage',
                        text: message
                    });
                });
            </script>
        </body>
    </html>
    `;
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("feedContent", () => {
    // 选中文字内容
    const selectedText = getSelectedText();
    console.log(selectedText);
  });
  context.subscriptions.push(disposable);

  // 这部分代码调用没有问题，但是本地跑起来加载不出来 webview，需要看下
  const chatViewProvider = new ChatViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "yourCustomViewId",
      chatViewProvider
    )
  );
}

class ChatViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    webviewView.webview.html = getChatboxHtml(this._extensionUri);

    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "sendMessage":
          // 给 webview 发送信息
          break;
      }
    });
  }
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
