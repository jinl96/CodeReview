import * as vscode from 'vscode';
import {
  languageMap,
  TLanguage,
  reactJSXKeywords,
  frontendCommonExt,
  languages,
} from './constants';
import path from 'path';
// @ts-ignore
import API from './server/server.js';

export function findLanguageByExtension(extensionName: string): TLanguage | undefined {
  for (const language in languageMap) {
    if (languageMap[language as TLanguage].includes(extensionName)) {
      return language as TLanguage;
    }
  }
  return undefined;
}

function isContentReact(content: string) {
  for (const keyword of reactJSXKeywords) {
    if (content.includes(keyword)) {
      return true;
    }
  }
  return false;
}

function getFileContent():
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
  const content = document.getText();
  // 文件拓展名 (file extension)
  const extensionName = fileName.split('.').pop() || '';
  let language;
  if (frontendCommonExt.includes(extensionName) && isContentReact) {
    if (isContentReact(content)) {
      language = languages.react;
    } else {
      language = languages.vue;
    }
  } else {
    language = findLanguageByExtension(extensionName);
  }
  return {
    content,
    language,
  };
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
  const extensionName = fileName.split('.').pop();
  const selection = editor.selection;
  const content = editor.document.getText(selection);
  console.log('选中的内容', content.trim().includes(`react`));
  return {
    content,
    language: getFileContent()?.language || undefined,
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

function sendSelectionMsg(language: TLanguage | undefined) {
  if (currentWebviewPanel) {
    currentWebviewPanel.webview.postMessage({
      type: 'selection',
      data: {
        tech: language,
      },
    });
  }
}

let currentWebviewPanel: vscode.WebviewView | undefined;

export function activate(context: vscode.ExtensionContext) {
  const isProduction = context.extensionMode === vscode.ExtensionMode.Production;
  let srcUrl = '';
  vscode.window.registerWebviewViewProvider(
    'sidebar_test_id1',
    {
      resolveWebviewView: panel => {
        currentWebviewPanel = panel;
        panel.webview.options = { enableScripts: true };
        if (isProduction) {
          const filePath = vscode.Uri.file(
            path.join(context.extensionPath, 'dist', 'static/js/main.js')
          );
          srcUrl = panel.webview.asWebviewUri(filePath).toString();
        } else {
          5;
          srcUrl = 'http://localhost:3000/static/js/main.js';
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

  let disposable = vscode.commands.registerCommand('feedContent', () => {
    // 选中文字内容
    const selectedText = getSelectedText();
    console.log('发送代码内容:', selectedText?.content);
    console.log('代码语言为:', selectedText?.language);
    console.log('等待回复中....');
    // 自动跳转到 webview，后面的 id 后续要随 webview 名称修改
    vscode.commands.executeCommand('workbench.view.extension.sidebar_test');
    // 给 webview 发送代码片段信息
    if (currentWebviewPanel) {
      currentWebviewPanel.webview.postMessage({
        type: 'code',
        data: {
          content: selectedText?.content,
          language: selectedText?.language,
        },
      });
      sendSelectionMsg(selectedText?.language);
    }
    API(selectedText?.language, selectedText?.content)
      .then((res: any) => {
        if (currentWebviewPanel) {
          // 给 webview 发送 gpt api 返回信息
          currentWebviewPanel.webview.postMessage({
            type: 'response',
            data: {
              content: res,
            },
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  });

  const feedFile = vscode.commands.registerCommand('feedFile', () => {
    const selectedText = getFileContent();
    console.log(selectedText);
    vscode.commands.executeCommand('workbench.view.extension.sidebar_test');
    // 给 webview 发送代码片段信息
    if (currentWebviewPanel) {
      sendSelectionMsg(selectedText?.language);
      currentWebviewPanel.webview.postMessage({
        type: 'code',
        data: {
          content: selectedText?.content,
          language: selectedText?.language,
        },
      });
    }
    API(selectedText?.language, selectedText?.content)
      .then((res: any) => {
        if (currentWebviewPanel) {
          // 给 webview 发送 gpt api 返回信息
          currentWebviewPanel.webview.postMessage({
            type: 'response',
            data: {
              content: res,
            },
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(feedFile);
}
