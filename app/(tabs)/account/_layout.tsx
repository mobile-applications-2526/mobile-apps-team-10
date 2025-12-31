import ThemeSwitcher from "@/src/components/ThemeSwitcher";
import { useTheme } from "@/src/hooks/useTheme";
import { createAccountStyles } from "@/src/styles/account.styles";
import { Stack } from "expo-router";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function AccountLayout() {
  const theme = useTheme();
  const styles = createAccountStyles(theme as any);
  return (
    <GestureHandlerRootView
      style={{ flex: 1, justifyContent: "space-between" }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>
      <View
        style={{
          backgroundColor: theme.colors.background,
        }}
      >
        <ThemeSwitcher />
      </View>
    </GestureHandlerRootView>
  );
}
