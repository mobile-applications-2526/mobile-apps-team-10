import { useTheme } from "@/src/hooks/useTheme";
import AuthService from "@/src/services/auth.service";
import SessionService from "@/src/services/session.service";
import { createAccountStyles } from "@/src/styles/account.styles";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LoginScreen from "./login";

export default function AccountIndex() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const theme = useTheme();
  const styles = createAccountStyles(theme as any);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await SessionService.getSession();
      if (!mounted) return;
      try {
        // @ts-ignore
        const win = typeof window !== "undefined" ? (window as any) : undefined;
        const e2eUser = win && win.__E2E_USER ? win.__E2E_USER : null;
        setUser(data.session?.user ?? e2eUser ?? null);
      } catch (e) {
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    };

    init();

    const { data: listener } = SessionService.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        try {
          // @ts-ignore
          const win =
            typeof window !== "undefined" ? (window as any) : undefined;
          const e2eUser = win && win.__E2E_USER ? win.__E2E_USER : null;
          setUser(session?.user ?? e2eUser ?? null);
        } catch (e) {
          setUser(session?.user ?? null);
        }
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      await SecureStore.deleteItemAsync("user_password");

      setUser(null);
      router.replace("/(tabs)/account");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text testID="account-title" style={styles.title}>
          Account
        </Text>
        <Text>Loading…</Text>
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <View style={styles.container}>
      <Text testID="account-title" style={styles.title}>
        Account
      </Text>
      <Text style={{ marginBottom: 12 }}>{user.email}</Text>
      <TouchableOpacity
        onPress={async () => {
          handleLogout();
        }}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}
