import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import { Dropdown, Space, Button, Card } from "antd";
import { items } from "./metadata/menu";
import { languages, TLanguage } from "../constants";

const App: React.FC = () => {
  const [cards, setCards] = useState<{ title: string; content: string }[]>([
    {
      title: "demotitle",
      content: "demoContent",
    },
  ]);

  const [tech, setTech] = useState<TLanguage | null>(null);

  useEffect(() => {
    window.addEventListener("message", event => {
      const message = event.data; // The JSON data our extension sent
      switch (message.type) {
        case "code":
          setCards(item => [{ title: `Language Detected: ${message.data.language}`, content: message.data.content }]);
          break;
        case "response":
          setCards(item => [...item, { title: "Response", content: message.data.content }]);
          break;
        case "selection":
          setTech(message.data.tech);
        default:
          // do nothing
          break;
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
              <Space>{!tech ? "选择具体语言" : tech}</Space>
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
