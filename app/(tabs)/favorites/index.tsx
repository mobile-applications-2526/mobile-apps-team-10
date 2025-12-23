import ExpandableRecipe from "@/src/components/ExpandableRecipe";
import { useFavorites } from "@/src/context/FavoritesContext";
import { useTheme } from "@/src/hooks/useTheme";
import RecipesService from "@/src/services/recipes.service";
import SessionService from "@/src/services/session.service";
import { createFavoriteStyles } from "@/src/styles/favorites.styles";
import { User } from "@supabase/supabase-js";
import { Recipe } from "@types";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginModal from "../../(modals)/LoginModal";

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, refreshFavorites } = useFavorites();
  const [user, setUser] = useState<User | null>(null);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const theme = useTheme();
  const styles = createFavoriteStyles(theme as any);

  useEffect(() => {
    SessionService.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = SessionService.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadAll = async () => {
    const data = await RecipesService.fetchAll();
    setAllRecipes(data);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([loadAll(), refreshFavorites()]).finally(() =>
        setLoading(false)
      );
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="tomato" />
        </View>
      ) : favoriteRecipes.length === 0 ? (
        <Text style={styles.emptyText}>No favorites yet.</Text>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
