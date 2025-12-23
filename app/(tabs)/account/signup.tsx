import { useTheme } from "@/src/hooks/useTheme";
import SignupService from "@/src/services/signup.service";
import { createAccountStyles } from "@/src/styles/account.styles";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUpScreen() {
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
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
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
        style={{ marginTop: 12 }}
        activeOpacity={0.7}
      >
        <Text style={{ color: "blue" }}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}
