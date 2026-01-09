import { supabase } from '@/src/supabase/supabase';
import { getAuthRedirectUrl } from '@/src/utils/authConfig';

export class SignupService {
  async signUp(email: string, password: string) {
    const redirectUrl = getAuthRedirectUrl();
    console.log("Redirecting user to:", redirectUrl);

    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: redirectUrl,
      }
    });

    if (error) {
      return { error };
    }
    return { data, message: 'Check your email for confirmation.' };
  }
}

export default new SignupService();