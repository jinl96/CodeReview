import React from "react";
import type { MenuProps } from "antd";
import { languages } from "../../constants";

export const items: MenuProps["items"] = Object.keys(languages).map((item, idx) => ({
  key: idx.toString(),
  label: (
    <span rel="noopener noreferrer">
      {item}
    </span>
  ),
}));

// [
//   {
//     key: "1",
//     label: (
//       <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
//         1st menu item
//       </a>
//     ),
//   },
//   {
//     key: "2",
//     label: (
//       <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
//         2nd menu item (disabled)
//       </a>
//     ),
//   },
//   {
//     key: "3",
//     label: (
//       <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
//         3rd menu item (disabled)
//       </a>
//     ),
//   },
//   {
//     key: "4",
//     danger: true,
//     label: "a danger item",
//   },
// ];
