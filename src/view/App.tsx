import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import { Dropdown, Space, Button, Card } from "antd";
import { items } from "./metadata/menu";

const App: React.FC = () => {
  const [cards, setCards] = useState<{ title: string; content: string }[]>([
    {
      title: "demotitle",
      content: "demoContent",
    },
  ]);

  useEffect(() => {
    window.addEventListener("message", event => {
      const message = event.data; // The JSON data our extension sent
      if (message.type === "code") {
        setCards(item => [{ title: `Language Detected: ${message.data.language}`, content: message.data.content }]);
      } else if (message.type === 'response') {
        setCards(item => [...item, {title: 'Response', content:message.data.content}])
      }
    });
  }, []);

  return (
    <>
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <h2>Webview-react</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Dropdown menu={{ items }}>
            <a onClick={e => e.preventDefault()}>
              <Space>选择具体语言</Space>
            </a>
          </Dropdown>
          <Button>分析当前所在文件</Button>
        </div>
        <div style={{ flex: 1, marginTop: 10 }}>
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            {cards.map(card => (
              <Card title={card.title} size="small">
                <p>{card.content}</p>
              </Card>
            ))}
          </Space>
        </div>
      </div>
    </>
  );
};
export default App;
