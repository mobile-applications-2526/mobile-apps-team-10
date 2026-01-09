import { useTheme } from "@/src/hooks/useTheme";
import AuthService from "@/src/services/auth.service";
import { createAccountStyles } from "@/src/styles/account.styles";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const passwordRef = React.useRef<TextInput>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  const theme = useTheme();
  const styles = createAccountStyles(theme as any);

  // Load credentials from Keychain on mount
  useEffect(() => {
    async function loadSavedCredentials() {
      // ONLY run this on iOS or Android
      if (Platform.OS === "web") return;

      try {
        const savedEmail = await SecureStore.getItemAsync("user_email");
        const savedPassword = await SecureStore.getItemAsync("user_password");
        if (savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
        }
      } catch (e) {
        console.log("SecureStore not available", e);
      }
    }
    loadSavedCredentials();
  }, []);

  const signIn = async () => {
    // E2E helper: when running Cypress with ?e2e_login_success=1 we skip real auth
    try {
      if (
        typeof window !== "undefined" &&
        window.location.search.includes("e2e_login_success")
      ) {
        setResult("Login successful");
        router.replace("/account");
      }
    } catch (e) {
      // ignore in non-browser environments
    }

    const res = await AuthService.signIn(email, password);
    if (res.error) {
      setResult(res.error.message ?? String(res.error));
    } else {
      if (Platform.OS !== "web") {
        try {
          await SecureStore.setItemAsync("user_email", email);
          await SecureStore.setItemAsync("user_password", password);
        } catch (e) {
          console.log("Failed to save credentials", e);
        }
      }
      setResult("Login successful");
      router.replace("/account");
    }
  };

  return (
    <View
      style={[styles.container, { flex: 1, justifyContent: "space-between" }]}
    >
      <View>
        <Text style={styles.title}>Log in</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor={theme.colors.placeholder}
          testID="input-email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles.input}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
          // iOS and Android autofill
          textContentType="username"
          autoComplete="email"
        />

        <TextInput
          ref={passwordRef}
          placeholder="Password"
          placeholderTextColor={theme.colors.placeholder}
          testID="input-password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={signIn}
          // iOS and Android autofill
          textContentType="password"
          autoComplete="password"
        />
        <TouchableOpacity
          onPress={signIn}
          style={styles.button}
          activeOpacity={0.7}
          testID="btn-login"
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        {result && (
          <Text testID="login-result" style={styles.result}>
            {result}
          </Text>
        )}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/account/signup")}
          style={styles.linkSpacing}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>Don't have an account? Create one</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
