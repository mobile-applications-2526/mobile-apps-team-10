import { useFavorites } from "@/src/context/FavoritesContext";
import RecipesService from "@/src/services/recipes.service";
import { favoritesStyles as styles } from "@/src/styles/favorites.styles";
import { supabase } from "@/src/supabase/supabase";
import { Ionicons } from "@expo/vector-icons";
import { User } from "@supabase/supabase-js";
import { Recipe } from "@types";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginModal from "../../(modals)/LoginModal";

export default function FavoritesScreen() {
  const router = useRouter();
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

  // Filter recipes based on global favorites context
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
            <TouchableOpacity key={r.id} style={styles.card} onPress={() => router.push(`/(tabs)/recipes/${r.id}`)}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{r.title}</Text>
                  {r.description && <Text style={styles.cardDescription}>{r.description}</Text>}
                </View>
                <TouchableOpacity style={{ padding: 10 }} onPress={(e) => { e.stopPropagation(); toggleFavorite(r.id); }}>
                  <Ionicons name="heart" size={26} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal} />}
    </SafeAreaView>
  );
}