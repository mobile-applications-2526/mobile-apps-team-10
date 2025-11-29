import { supabase } from '@/src/supabase/supabase';

export class SignupService {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return { error };
    }
    return { data, message: 'Check your email for confirmation.' };
  }
}

export default new SignupService();
