export const languages = {
  react: "react",
  vue: "vue",
  js: "js",
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
  js: ["ts", "js"],
  ios: ["swift", "m", "mm", "h"],
};

export const reactJSXKeywords = [
  'react',
  'React',
  'className',
  'useState',
  'useEffect'
]

export const frontendCommonExt = ['jsx','tsx'];
