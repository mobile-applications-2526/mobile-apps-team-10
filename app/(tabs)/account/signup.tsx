import SignupService from '@/src/services/signup.service';
import { styles } from '@/src/styles/account.styles';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  const signUp = async () => {
    const res = await SignupService.signUp(email, password);
    if (res.error) {
      setResult(res.error.message ?? String(res.error));
    } else {
      setResult(res.message ?? 'Check your email for confirmation.');
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

      <Pressable onPress={signUp} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      {result && <Text style={styles.result}>{result}</Text>}
      <Pressable onPress={() => router.push('/(tabs)/account/login')} style={{ marginTop: 12 }}>
        <Text style={{ color: 'blue' }}>Already have an account? Log in</Text>
      </Pressable>
    </View>
  );
}
