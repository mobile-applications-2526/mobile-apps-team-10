import { supabase } from '@/src/supabase/supabase';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Test() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('test').select('*');
      if (error) console.log(error);
      setRows(data || []);
      console.log(data);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  console.log(rows);
  return (
    <View style={{ padding: 20 }}>
      {rows.map((r) => (
        <Text key={r.id}>{JSON.stringify(r)}</Text>
      ))}
    </View>
  );
}
