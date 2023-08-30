export const languages = {
  react: "react",
  vue: "vue",
  javascript: "javascript",
  ios: "ios",
  kotlin: "kotlin",
  java: "java",
  oc: "oc",
  swift: "swift",
} as const;

export type TLanguage = keyof typeof languages;

// 代码语言映射
export const languageMap: { [key in TLanguage]: string[] } = {
  react: ["jsx", "tsx"],
  vue: ["vue"],
  java: ["java", "kt"],
  oc: ["m", "mm", "h"],
  kotlin: ["kts", "ktm"],
  swift: ["swift"],
  javascript: ["ts", "js"],
  ios: ["swift", "m", "mm", "h"],
};
