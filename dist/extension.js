/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = exports.findLanguageByExtension = void 0;
const vscode = __importStar(__webpack_require__(1));
const constants_1 = __webpack_require__(2);
const path_1 = __importDefault(__webpack_require__(3));
function findLanguageByExtension(extensionName) {
    for (const language in constants_1.languageMap) {
        if (constants_1.languageMap[language].includes(extensionName)) {
            return language;
        }
    }
    return undefined;
}
exports.findLanguageByExtension = findLanguageByExtension;
function getSelectedText() {
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
function getWebviewContent(srcUri) {
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
function activate(context) {
    let disposable = vscode.commands.registerCommand("feedContent", () => {
        // 选中文字内容
        const selectedText = getSelectedText();
        console.log(selectedText);
    });
    context.subscriptions.push(disposable);
    const isProduction = context.extensionMode === vscode.ExtensionMode.Production;
    let srcUrl = "";
    vscode.window.registerWebviewViewProvider("sidebar_test_id1", {
        resolveWebviewView: (panel) => {
            panel.webview.options = { enableScripts: true };
            if (isProduction) {
                const filePath = vscode.Uri.file(path_1.default.join(context.extensionPath, "dist", "static/js/main.js"));
                srcUrl = panel.webview.asWebviewUri(filePath).toString();
            }
            else {
                5;
                srcUrl = "http://localhost:3000/static/js/main.js";
            }
            panel.webview.html = getWebviewContent(srcUrl);
            const updateWebview = () => {
                panel.webview.html = getWebviewContent(srcUrl);
            };
            updateWebview();
            const interval = setInterval(updateWebview, 1000);
            panel.onDidDispose(() => {
                clearInterval(interval);
            }, null, context.subscriptions);
        },
    }, {
        webviewOptions: {
            retainContextWhenHidden: true,
        },
    });
}
exports.activate = activate;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.languageMap = exports.languages = void 0;
exports.languages = {
    react: "react",
    vue: "vue",
    java: "java",
    javascript: "javascript",
    swift: "swift",
    objectivec: "objectivec",
};
// 代码语言映射
exports.languageMap = {
    react: ["jsx", "tsx"],
    vue: ["vue"],
    java: ["java"],
    javascript: ["ts", "js"],
    swift: ["swift"],
    objectivec: ["m", "mm", "h"],
};


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("path");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map