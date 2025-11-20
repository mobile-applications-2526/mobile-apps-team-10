import { supabase } from '@/src/supabase/supabase';

export default function Test() {
  const test = async () => {
    const { data, error } = await supabase.from('test').select('*');
    console.log(data, error);
  };

  test();

  return <p>no error</p>;
}
