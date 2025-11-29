import { TextStyle } from "react-native";

export const theme = {
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
  },
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
} as const;

export default theme;
