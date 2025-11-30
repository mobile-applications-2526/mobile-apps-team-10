import AuthService from '@/src/services/auth.service';
import { styles } from '@/src/styles/account.styles';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  const signIn = async () => {
    const res = await AuthService.signIn(email, password);
    if (res.error) {
      setResult(res.error.message ?? String(res.error));
    } else {
      setResult('Login successful');
      router.replace('/account');
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

      <Pressable onPress={signIn} style={styles.button}>
        <Text style={styles.buttonText}>Log in</Text>
      </Pressable>

      {result && <Text style={styles.result}>{result}</Text>}
      <Pressable
        onPress={() => router.push('/(tabs)/account/signup')}
        style={{ marginTop: 12 }}
      >
        <Text style={{ color: 'blue' }}>Don't have an account? Create one</Text>
      </Pressable>
    </View>
  );
}
