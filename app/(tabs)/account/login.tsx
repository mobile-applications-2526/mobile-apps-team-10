import AuthService from "@/src/services/auth.service";
import { styles } from "@/src/styles/account.styles";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  const signIn = async () => {
    const res = await AuthService.signIn(email, password);
    if (res.error) {
      setResult(res.error.message ?? String(res.error));
    } else {
      setResult("Login successful");
      router.replace("/account");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>

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
        onPress={signIn}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>

      {result && <Text style={styles.result}>{result}</Text>}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/account/signup")}
        style={{ marginTop: 12 }}
        activeOpacity={0.7}
      >
        <Text style={{ color: "blue" }}>Don't have an account? Create one</Text>
      </TouchableOpacity>
    </View>
  );
}
