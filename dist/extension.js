/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = void 0;
const vscode = __webpack_require__(1);
function getSelectedText() {
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
function getChatboxHtml(extensionUri) {
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
function activate(context) {
    let disposable = vscode.commands.registerCommand("feedContent", () => {
        // 选中文字内容
        const selectedText = getSelectedText();
    });
    context.subscriptions.push(disposable);
    // 这部分代码调用没有问题，但是本地跑起来加载不出来 webview，需要看下
    const chatViewProvider = new ChatViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("yourCustomViewId", chatViewProvider));
}
exports.activate = activate;
class ChatViewProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView) {
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
vscode.window.registerWebviewViewProvider("sidebar_test_id1", {
    resolveWebviewView: (webviewView, context) => {
        // 在这里设置自定义视图的 HTML 内容、事件处理等
        webviewView.webview.html = "<h1>Hello from Webview!</h1>";
    },
}, {
    webviewOptions: {
        retainContextWhenHidden: true,
    },
});

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map