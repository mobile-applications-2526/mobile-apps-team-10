import FavoritesService from "@/src/services/favorites.service";
import RecipesService from "@/src/services/recipes.service";
import { favoritesStyles as styles } from "@/src/styles/favorites.styles";
import { supabase } from "@/src/supabase/supabase";
import { User } from "@supabase/supabase-js";
import { Recipe } from "@types";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginModal from "../(modals)/LoginModal";

export default function FavoritesScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favIds, setFavIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // check login
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };
    checkUser();

    // listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // load favorites only when user exists
  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setLoading(false);
        setRecipes([]);
        setFavIds([]);
        return;
      }

      const load = async () => {
        setLoading(true);
        const favs = await FavoritesService.getFavorites(user.id);
        const all = await RecipesService.fetchAll();
        setFavIds(favs);
        setRecipes(all.filter((r) => favs.includes(r.id)));
        setLoading(false);
      };

      load();
    }, [user])
  );

  // Refresh handler
  const onRefresh = async () => {
    if (!user) return;

    setRefreshing(true);
    const favs = await FavoritesService.getFavorites(user.id);
    const all = await RecipesService.fetchAll();
    setFavIds(favs);
    setRecipes(all.filter((r) => favs.includes(r.id)));
    setRefreshing(false);
  };

  return (
    <>
      <SafeAreaView style={styles.screen}>
        <Text style={styles.title}>Favorites</Text>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        )}

        {!loading && recipes.length === 0 && (
          <Text style={styles.emptyText}>No favorites yet.</Text>
        )}

        {!loading && (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={styles.listWrapper}
          >
            {recipes.map((r) => (
              <Link href={`/recipes/${r.id}`} key={r.id} style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{r.title}</Text>
                  {r.description && (
                    <Text style={styles.cardDescription}>{r.description}</Text>
                  )}
                </View>
              </Link>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>

      {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal} />}
    </>
  );
}
