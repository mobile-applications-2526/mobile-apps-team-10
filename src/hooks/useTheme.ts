import { useThemeContext } from "@/src/context/ThemeSwitcher";

export function useTheme() {
  const { theme } = useThemeContext();
  return theme;
}