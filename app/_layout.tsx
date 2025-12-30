import { FavoritesProvider } from "@/src/context/FavoritesContext";
import { ThemeProvider } from "@/src/context/ThemeSwitcher"; // <--- Update this import
import { useTheme } from "@/src/hooks/useTheme";
import SessionService from "@/src/services/session.service";
import { Ionicons } from "@expo/vector-icons";
import { User } from "@supabase/supabase-js";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    const checkUser = async () => {
      const { data } = await SessionService.getUser();
      if (!mounted) return;
      setUser(data.user ?? null);
      setChecking(false);
    };
    checkUser();

    const { data: listener } = SessionService.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
        setChecking(false);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (checking) return null;

  return (
    <ThemeProvider>
      <FavoritesProvider>
        <LayoutContent user={user} />
      </FavoritesProvider>
    </ThemeProvider>
  );
}

// Separate component so useTheme() can access the ThemeContext
function LayoutContent({ user }: { user: User | null | undefined }) {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.placeholder,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="(tabs)/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/favorites"
        options={{
          title: "Favorites",
          href: user ? "/(tabs)/favorites" : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="(modals)/LoginModal" options={{ href: null }} />
    </Tabs>
  );
}
