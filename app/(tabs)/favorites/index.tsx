import { useFavorites } from "@/src/context/FavoritesContext";
import RecipesService from "@/src/services/recipes.service";
import { favoritesStyles as styles } from "@/src/styles/favorites.styles"; // Note: you might need to add expanded styles here or use recipes.styles
import { supabase } from "@/src/supabase/supabase";
import { User } from "@supabase/supabase-js";
import { Recipe } from "@types";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginModal from "../../(modals)/LoginModal";
import ExpandableRecipe from "@/src/components/ExpandableRecipe";

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, refreshFavorites } = useFavorites();
  const [user, setUser] = useState<User | null>(null);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadAll = async () => {
    const data = await RecipesService.fetchAll();
    setAllRecipes(data);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([loadAll(), refreshFavorites()]).finally(() => setLoading(false));
    }, [user])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadAll(), refreshFavorites()]);
    setRefreshing(false);
  };

  const favoriteRecipes = allRecipes.filter((r) => favorites.includes(r.id));

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Your Favorites</Text>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}><ActivityIndicator color="tomato" /></View>
      ) : favoriteRecipes.length === 0 ? (
        <Text style={styles.emptyText}>No favorites yet.</Text>
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          style={styles.listWrapper}
        >
          {favoriteRecipes.map((r) => (
            <ExpandableRecipe
              key={r.id}
              recipe={r}
              isFavorite={true}
              onToggleFavorite={() => toggleFavorite(r.id)}
              showServingsControls={true}
              containerStyle={styles.card}
            />
          ))}
        </ScrollView>
      )}
      {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal} />}
    </SafeAreaView>
  );
}