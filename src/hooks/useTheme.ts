import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "@/src/styles/theme";

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkTheme : lightTheme;
}
