import { supabase } from '@/src/supabase/supabase';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setResult(error.message);
    } else {
      setResult('Check your email for confirmation');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />

      <TextInput
        placeholder="password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />

      <Button title="Sign Up" onPress={signUp} />

      {result && <Text style={{ marginTop: 20 }}>{result}</Text>}
    </View>
  );
}
