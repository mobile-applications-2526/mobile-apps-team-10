import { useFavorites } from "@/src/context/FavoritesContext"; // Import the hook
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
  const { favorites, toggleFavorite, refreshFavorites } = useFavorites(); // Use global context
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [filterText, setFilterText] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [maxTime, setMaxTime] = useState<number | null>(null);


  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };
    load();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshFavorites(), loadRecipes()]);
    setRefreshing(false);
  };

  const loadRecipes = async () => {
    try {
      const data = await RecipesService.fetchAll();
      setRecipes(data);
      setFilteredRecipes(RecipesService.filterByIngredients(data, selectedIngredients));
    } catch (err) {
      console.log("Failed to load recipes", err);
    }
  };

  useEffect(() => {
    loadRecipes().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = RecipesService.filterByIngredients(recipes, selectedIngredients);
    result = RecipesService.filterByTime(result, maxTime);
    setFilteredRecipes(result);
  }, [selectedIngredients, maxTime, recipes]);


  const handleToggleFavorite = async (id: number) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    await toggleFavorite(id);
  };

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator /></View>;

  return (
    <View style={styles.screen}>
      <View style={styles.header}><Text style={styles.pageTitle}>Recipes</Text></View>

      <View style={styles.filterSection}>
        <TextInput
          style={styles.input}
          placeholder="Enter ingredient..."
          value={filterText}
          onChangeText={setFilterText}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => {
          const ing = filterText.trim().toLowerCase();
          if (ing && !selectedIngredients.includes(ing)) setSelectedIngredients([...selectedIngredients, ing]);
          setFilterText("");
        }}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <TextInput
          style={styles.input}
          placeholder="Max time (minutes)"
          keyboardType="numeric"
          value={maxTime?.toString() ?? ""}
          onChangeText={(text) => {
              if (text.trim() === "") {
                  setMaxTime(null); // ✅ remove filter
                  return;
                }
            const value = Number(text);
            setMaxTime(isNaN(value) ? null : value);
          }}
        />
      </View>

      <View style={styles.selectedList}>
        {selectedIngredients.map((ing) => (
          <View key={ing} style={styles.selectedItem}>
            <Text>{ing}</Text>
            <TouchableOpacity onPress={() => setSelectedIngredients(selectedIngredients.filter(i => i !== ing))}>
              <Text style={styles.remove}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.container}
      >
        {filteredRecipes.map((recipe) => {
          const isExpanded = expandedIds.includes(recipe.id);
          const isFav = favorites.includes(recipe.id);
          return (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => {
                setExpandedIds((prev) =>
                  prev.includes(recipe.id)
                    ? prev.filter((i) => i !== recipe.id)
                    : [...prev, recipe.id]
                );
              }}
            >
              {/* Title + favorite */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.title}>{recipe.title}</Text>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(recipe.id);
                  }}
                >
                  <Ionicons
                    name={isFav ? "heart" : "heart-outline"}
                    size={24}
                    color={isFav ? "red" : "black"}
                  />
                </TouchableOpacity>
              </View>

              {/* Description */}
              {recipe.description && (
                <Text style={styles.description}>{recipe.description}</Text>
              )}

              {/* ✅ ALWAYS visible */}
              {recipe.time_minutes !== null && (
                <Text style={styles.time}>
                  ⏱ {recipe.time_minutes} min
                </Text>
              )}

              {/* Expanded content */}
              {isExpanded && (
                <>
                  <Text style={styles.subheading}>Ingredients</Text>
                  {recipe.recipe_ingredients.map((ri) => (
                    <Text key={ri.ingredient_id} style={styles.ingredient}>
                      {ri.quantity} {ri.unit} {ri.ingredients.name}
                    </Text>
                  ))}

                  <Text style={styles.subheading}>Steps</Text>
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
      {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal} />}
    </View>
  );
}