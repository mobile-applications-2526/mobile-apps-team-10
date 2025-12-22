import { supabase } from '@/src/supabase/supabase';

class AuthService {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };
    return { data };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }
}

export default new AuthService();