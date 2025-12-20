import { useFavorites } from "@/src/context/FavoritesContext";
import RecipesService from "@/src/services/recipes.service";
import { favoritesStyles as styles } from "@/src/styles/favorites.styles"; // Note: you might need to add expanded styles here or use recipes.styles
import { supabase } from "@/src/supabase/supabase";
import { Ionicons } from "@expo/vector-icons";
import { User } from "@supabase/supabase-js";
import { Recipe } from "@types";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginModal from "../../(modals)/LoginModal";

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, refreshFavorites } = useFavorites();
  const [user, setUser] = useState<User | null>(null);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [expandedIds, setExpandedIds] = useState<number[]>([]);

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

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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
          {favoriteRecipes.map((r) => {
            const isExpanded = expandedIds.includes(r.id);
            return (
              <TouchableOpacity
                key={r.id}
                style={styles.card}
                onPress={() => toggleExpand(r.id)}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{r.title}</Text>
                    <Text style={styles.cardDescription}>{r.description}</Text>
                  </View>
                  <TouchableOpacity style={{ padding: 10 }} onPress={(e) => { e.stopPropagation(); toggleFavorite(r.id); }}>
                    <Ionicons name="heart" size={26} color="red" />
                  </TouchableOpacity>
                </View>

                {isExpanded && (
                  <View style={{ marginTop: 15, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Ingredients:</Text>
                    {r.recipe_ingredients?.map((ri) => (
                      <Text key={ri.ingredient_id} style={{ marginBottom: 2 }}>
                        • {ri.quantity} {ri.unit} {ri.ingredients.name}
                      </Text>
                    ))}

                    <Text style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 5 }}>Steps:</Text>
                    {r.steps?.map((step, index) => (
                      <Text key={index} style={{ marginBottom: 4 }}>
                        {index + 1}. {step}
                      </Text>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
      {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal} />}
    </SafeAreaView>
  );
}