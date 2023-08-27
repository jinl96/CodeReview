import * as vscode from "vscode";

function getSelectedText(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return undefined;
  }
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
  });
  context.subscriptions.push(disposable);

  // 这部分代码调用没有问题，但是本地跑起来加载不出来 webview，需要看下
  const chatViewProvider = new ChatViewProvider(context.extensionUri);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider("yourCustomViewId", chatViewProvider));
}

class ChatViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    webviewView.webview.html = getChatboxHtml(this._extensionUri);

    webviewView.webview.onDidReceiveMessage(message => {
      switch (message.command) {
        case "sendMessage":
          // 给 webview 发送信息
          break;
      }
    });
  }
}
