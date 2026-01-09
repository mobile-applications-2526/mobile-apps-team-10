import { useTheme } from "@/src/hooks/useTheme";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function AuthCallback() {
  const theme = useTheme();

  useEffect(() => {
    // We wait 3 seconds so they can actually read the success message
    const timeout = setTimeout(() => {
      // Redirect to the login page
      router.replace("/(tabs)/account/login");
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
        padding: 20,
      }}
    >
      <View
        style={{
          padding: 30,
          borderRadius: 20,
          backgroundColor: theme.colors.background,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.accent} />

        <Text
          style={{
            marginTop: 20,
            fontSize: 22,
            fontWeight: "bold",
            color: theme.colors.text,
            textAlign: "center",
          }}
        >
          Email Verified!
        </Text>

        <Text
          style={{
            marginTop: 12,
            fontSize: 16,
            color: theme.colors.text,
            textAlign: "center",
            lineHeight: 22,
          }}
        >
          Your account is now active.{"\n"}Redirecting you to the login page...
        </Text>
      </View>
    </View>
  );
}
