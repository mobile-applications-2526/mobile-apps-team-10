import FavoritesService from "@/src/services/favorites.service";
import RecipesService from "@/src/services/recipes.service";
import { styles } from "@/src/styles/recipes.styles";
import { supabase } from "@/src/supabase/supabase";
import { Ionicons } from "@expo/vector-icons";
import { User } from "@supabase/supabase-js";
import { Recipe } from "@types";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LoginModal from "../../(modals)/LoginModal";

export default function FetchRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [filterText, setFilterText] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load user once
  // Maybe we can move this to a global context later
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };
    load();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  // Fetch favorites if logged in
  useEffect(() => {
    if (!user) return;
    const fetchFavs = async () => {
      const favs = await FavoritesService.getFavorites(user.id);
      setFavorites(favs);
    };
    fetchFavs();
  }, [user]);

  const toggleFavorite = async (id: number) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const isFav = favorites.includes(id);

    if (isFav) {
      await FavoritesService.removeFavorite(id);
      setFavorites((prev) => prev.filter((f) => f !== id));
    } else {
      await FavoritesService.addFavorite(id);
      setFavorites((prev) => [...prev, id]);
    }
  };

  // Refresh handler
  const onRefresh = async () => {
    if (!user) return;

    setRefreshing(true);
    const favs = await FavoritesService.getFavorites(user.id);
    const all = await RecipesService.fetchAll();
    setFavorites(favs);
    setRecipes(all.filter((r) => favs.includes(r.id)));
    setRefreshing(false);
  };

  const handleAddIngredient = () => {
    const ing = filterText.trim().toLowerCase();
    if (!ing || selectedIngredients.includes(ing)) return;
    setSelectedIngredients([...selectedIngredients, ing]);
    setFilterText("");
  };

  const handleRemoveIngredient = (ing: string) => {
    setSelectedIngredients(selectedIngredients.filter((i) => i !== ing));
  };

  useEffect(() => {
    const filtered = RecipesService.filterByIngredients(
      recipes,
      selectedIngredients
    );
    setFilteredRecipes(filtered);
  }, [selectedIngredients, recipes]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await RecipesService.fetchAll();
        if (!mounted) return;
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (err) {
        console.log("Failed to load recipes", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Recipes</Text>
      </View>

      {/* Filter adhv ingrediënten */}
      <View style={styles.filterSection}>
        <TextInput
          style={styles.input}
          placeholder="Enter ingredient..."
          value={filterText}
          onChangeText={setFilterText}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddIngredient}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.selectedList}>
        {selectedIngredients.map((ing) => (
          <View key={ing} style={styles.selectedItem}>
            <Text>{ing}</Text>
            <TouchableOpacity onPress={() => handleRemoveIngredient(ing)}>
              <Text style={styles.remove}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Toon recepten */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.container}
      >
        {filteredRecipes.map((recipe) => {
          const isExpanded = expandedIds.includes(recipe.id);
          return (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => toggleExpand(recipe.id)}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.title}>{recipe.title}</Text>

                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(recipe.id);
                  }}
                >
                  <Ionicons
                    name={
                      favorites.includes(recipe.id) ? "heart" : "heart-outline"
                    }
                    size={24}
                    color={favorites.includes(recipe.id) ? "red" : "black"}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.description}>{recipe.description}</Text>

              {isExpanded && (
                <>
                  <Text style={styles.subheading}>Ingredients:</Text>
                  {recipe.recipe_ingredients.map((ri) => (
                    <Text key={ri.ingredient_id} style={styles.ingredient}>
                      {ri.quantity} {ri.unit} {ri.ingredients.name}
                    </Text>
                  ))}

                  <Text style={styles.subheading}>Steps:</Text>
                  {recipe.steps.map((step, index) => (
                    <Text key={index} style={styles.step}>
                      {index + 1}. {step}
                    </Text>
                  ))}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {showLoginModal && (
        <LoginModal setShowLoginModal={setShowLoginModal}></LoginModal>
      )}
    </View>
  );
}
