import { useTheme } from "@/src/hooks/useTheme";
import SignupService from "@/src/services/signup.service";
import { createAccountStyles } from "@/src/styles/account.styles";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUpScreen() {
  const passwordRef = React.useRef<TextInput>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  const theme = useTheme();
  const styles = createAccountStyles(theme as any);

  const signUp = async () => {
    const res = await SignupService.signUp(email, password);
    if (res.error) {
      setResult(res.error.message ?? String(res.error));
    } else {
      setResult(res.message ?? "Check your email for confirmation.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={theme.colors.placeholder}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
        // iOS and Android autofill
        textContentType="username"
        autoComplete="email"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      <TextInput
        ref={passwordRef}
        placeholder="Password"
        placeholderTextColor={theme.colors.placeholder}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        // NATIVE KEYCHAIN HINTS:
        textContentType="newPassword"
        autoComplete="password-new"
        onSubmitEditing={signUp}
        returnKeyType="done"
      />

      <TouchableOpacity
        onPress={signUp}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {result && <Text style={styles.result}>{result}</Text>}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/account/login")}
        style={styles.linkSpacing}
        activeOpacity={0.7}
      >
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}
