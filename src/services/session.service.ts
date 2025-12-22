import { supabase } from '@/src/supabase/supabase';

class SessionService {
  async getSession() {
    return await supabase.auth.getSession();
  }

  async getUser() {
    return await supabase.auth.getUser();
  }

  onAuthStateChange(cb: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(cb);
  }
}

export default new SessionService();

