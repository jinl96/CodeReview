export const languages = {
  react: "react",
  vue: "vue",
  java: "java",
  javascript: "javascript",
  swift: "swift",
  objectivec: "objectivec",
} as const;

export type TLanguage = keyof typeof languages;

// 代码语言映射
export const languageMap: { [key in TLanguage]: string[] } = {
  react: ["jsx", "tsx"],
  vue: ["vue"],
  java: ["java"],
  javascript: ["ts", "js"],
  swift: ["swift"],
  objectivec: ["m", "mm", "h"],
};
