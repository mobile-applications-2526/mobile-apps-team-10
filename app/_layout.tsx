import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import SessionService from "@/src/services/session.service";
import { User } from "@supabase/supabase-js";
import { FavoritesProvider } from "@/src/context/FavoritesContext";

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

    const { data: listener } = SessionService.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setChecking(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (checking) return null;

  return (
      <FavoritesProvider>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="(tabs)/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="(tabs)/recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="(tabs)/favorites"
        options={{
          title: "Favorites",
          href: user ? "/(tabs)/favorites" : null,
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="(tabs)/account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="(modals)/LoginModal"
        options={{ href: null }}
      />
    </Tabs>
    </FavoritesProvider>
  );
}