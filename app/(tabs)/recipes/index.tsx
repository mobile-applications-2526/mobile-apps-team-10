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
  const [servingsById, setServingsById] = useState<Record<number, number>>({});

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
    setFilteredRecipes(RecipesService.filterByIngredients(recipes, selectedIngredients));
  }, [selectedIngredients, recipes]);

  const handleToggleFavorite = async (id: number) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    await toggleFavorite(id);
  };

  const getServings = (id: number) => servingsById[id] ?? 1;
  const setServings = (id: number, value: number) => setServingsById((prev) => ({ ...prev, [id]: value }));
  const increaseServings = (id: number) => setServings(id, getServings(id) + 1);
  const decreaseServings = (id: number) => setServings(id, Math.max(1, getServings(id) - 1));

  const formatQuantity = (value: number) => {
    if (Number.isInteger(value)) return value.toString();
    const rounded = Math.round(value * 100) / 100;
    return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toString();
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
            <TouchableOpacity key={recipe.id} style={styles.recipeCard} onPress={() => {
              setExpandedIds(prev => prev.includes(recipe.id) ? prev.filter(i => i !== recipe.id) : [...prev, recipe.id]);
            }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.title}>{recipe.title}</Text>
                <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleToggleFavorite(recipe.id); }}>
                  <Ionicons name={isFav ? "heart" : "heart-outline"} size={24} color={isFav ? "red" : "black"} />
                </TouchableOpacity>
              </View>
              <Text style={styles.description}>{recipe.description}</Text>
              {isExpanded && (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 6 }}>
                    <Text style={{ marginRight: 8 }}>Persons:</Text>
                    <TouchableOpacity onPress={(e) => {
                        e.stopPropagation();
                        decreaseServings(recipe.id); }}
                        style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#eee', borderRadius: 6, marginRight: 8 }}
                    >
                      <Text>-</Text>
                    </TouchableOpacity>
                    <View style={{ minWidth: 32, alignItems: 'center' }}>
                      <Text>{getServings(recipe.id)}</Text>
                    </View>
                    <TouchableOpacity onPress={(e) => {
                        e.stopPropagation();
                        increaseServings(recipe.id); }}
                        style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#eee', borderRadius: 6, marginLeft: 8 }}
                    >
                      <Text>+</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.subheading}>Ingredients:</Text>
                  {recipe.recipe_ingredients.map((ri) => {
                    const servings = getServings(recipe.id);
                    const scaled = (ri.quantity * servings) / 1;
                    return (
                      <Text key={ri.ingredient_id} style={styles.ingredient}>{formatQuantity(scaled)} {ri.unit} {ri.ingredients.name}</Text>
                    );
                  })}
                  <Text style={styles.subheading}>Steps:</Text>
                  {recipe.steps.map((step, index) => <Text key={index} style={styles.step}>{index + 1}. {step}</Text>)}
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