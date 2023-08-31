import React, { useState, useEffect } from 'react';
import { Dropdown, Space, Button, Card } from 'antd';
import { items } from './metadata/menu';
import { TLanguage } from '../constants';
import API from '../server/server.js';

const app: React.FC = () => {
  const [cards, setCards] = useState<{ type: 'req' | 'res'; title: string; content: string }[]>([]);

  const [content, setContent] = useState<{ title: string; content: string }>({
    title: '请在编辑器内右键选择代码',
    content: '',
  });

  const [response, setResponse] = useState<{
    title: string;
    content: string;
  } | null>(null);

  // 当前技术栈
  const [tech, setTech] = useState<TLanguage | null>(null);
  // 请求是否已经发送
  const [reqSent, setReqSent] = useState<boolean>(false);

  const startReview = (language:TLanguage, content: string) => {
    API(language, content)
    .then((res: any) => {
      setResponse({
        title:'Response',
        content: res,
      })
    })
    .catch(err => {
      console.log(err);
    });
  };

  useEffect(() => {
    const listener = (event: any) => {
      const message = event.data; // The JSON data our extension sent
      switch (message.type) {
        case 'code':
          setContent({
            title: `Language Detected: ${message.data.language}`,
            content: message.data.content,
          });
          startReview(message.data.language, message.data.content);
          break;
        case 'response':
          const lastReq = cards.find(item => item.type === 'req');
          const prevItem = lastReq ? [lastReq] : [];
          setResponse({ title: 'Response', content: message.data.content });
          break;
        case 'selection':
          setTech(message.data.tech);
        default:
          // do nothing
          break;
      }
    };
    window.addEventListener('message', listener);
    // cleanup
    return () => {
      window.removeEventListener('message', listener);
    };
  }, []);

  return (
    <>
      <div
        style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <h2>Webview-react</h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Dropdown menu={{ items }}>
            <a onClick={e => e.preventDefault()}>
              <Space>{!tech ? '选择具体语言' : tech}</Space>
            </a>
          </Dropdown>
          <Button onClick={e => startReview()}>分析当前代码</Button>
        </div>
        <div style={{ flex: 1, marginTop: 10 }}>
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card title={content.title} size="small">
              <p>{content.content}</p>
            </Card>
            {response && (
              <Card title={response.title} size="small">
                <p>{response.content}</p>
              </Card>
            )}
          </Space>
        </div>
      </div>
    </>
  );
};
export default app;
