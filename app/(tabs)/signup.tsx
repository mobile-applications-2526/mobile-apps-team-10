import { styles } from '@/src/styles/signup.styles';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import SignupService from '@/src/services/signup.service';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<string | null>(null);

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

      <Button title="Sign Up" onPress={signUp} />

      {result && <Text style={styles.result}>{result}</Text>}
    </View>
  );
}