import { TextStyle } from "react-native";

const theme = {
  spacing: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 20,
    xl: 30,
  },
  radii: {
    sm: 6,
    md: 8,
    lg: 12,
    round: 20,
  },
  fontSizes: {
    xl: 30,
    lg: 28,
    md: 22,
    sm: 16,
    xs: 14,
  },
  fontWeights: {
    regular: "400" as TextStyle["fontWeight"],
    semibold: "600" as TextStyle["fontWeight"],
    bold: "700" as TextStyle["fontWeight"],
    extra: "800" as TextStyle["fontWeight"],
  },
};

export const lightTheme = {
  ...theme,
  colors: {
    background: "#ffffff",
    primary: "#2196f3",
    accent: "tomato",
    muted: "#f7f7f7",
    border: "#cccccc",
    text: "#000000",
    placeholder: "#aaaaaa",
    danger: "red",
    white: "#ffffff",
    modalBackground: "rgba(0,0,0,0.3)",
  },
};

export const darkTheme = {
  ...theme,
  colors: {
    background: "#000000",
    primary: "#90caf9",
    accent: "tomato",
    muted: "#1c1c1e",
    border: "#2c2c2e",
    text: "#ffffff",
    placeholder: "#888888",
    danger: "#ff6b6b",
    white: "#ffffff",
    modalBackground: "rgba(255,255,255,0.2)",
  },
};

export type Theme = typeof lightTheme;
