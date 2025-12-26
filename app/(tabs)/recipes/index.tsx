import ExpandableRecipe from "@/src/components/ExpandableRecipe";
import { useFavorites } from "@/src/context/FavoritesContext";
import { useTheme } from "@/src/hooks/useTheme";
import RecipesService from "@/src/services/recipes.service";
import SessionService from "@/src/services/session.service";
import { createRecipeStyles } from "@/src/styles/recipes.styles";
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
  const { favorites, toggleFavorite, refreshFavorites } = useFavorites();
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
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const theme = useTheme();
  const styles = createRecipeStyles(theme as any);

  useEffect(() => {
    const load = async () => {
      const { data } = await SessionService.getSession();
      // E2E fallback
      try {
        // @ts-ignore
        const win = typeof window !== 'undefined' ? (window as any) : undefined;
        const e2eUser = win && win.__E2E_USER ? win.__E2E_USER : null;
        setUser(data.session?.user ?? e2eUser ?? null);
      } catch (e) {
        setUser(data.session?.user ?? null);
      }
    };
    load();
    const { data: listener } = SessionService.onAuthStateChange(
      (_event, session) => {
        try {
        // @ts-ignore
        const win = typeof window !== 'undefined' ? (window as any) : undefined;
        const e2eUser = win && win.__E2E_USER ? win.__E2E_USER : null;
        setUser(session?.user ?? e2eUser ?? null);
      } catch (e) {
        setUser(session?.user ?? null);
        }
    }
    );
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
      setFilteredRecipes(
        RecipesService.filterByIngredients(data, selectedIngredients)
      );
    } catch (err) {
      console.log("Failed to load recipes", err);
    }
  };

  useEffect(() => {
    loadRecipes().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = RecipesService.filterByIngredients(
      recipes,
      selectedIngredients
    );
    result = RecipesService.filterByTime(result, maxTime);
    result = RecipesService.filterByMaxPrice(result, maxPrice);
    setFilteredRecipes(result);
  }, [selectedIngredients, maxTime, maxPrice, recipes]);

  const handleToggleFavorite = async (id: number) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    await toggleFavorite(id);
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

      <View style={styles.filterSection}>
        <TextInput
          style={styles.input}
          placeholder="Enter ingredient..."
          value={filterText}
          onChangeText={setFilterText}
          testID="filter-input"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            const ing = filterText.trim().toLowerCase();
            if (ing && !selectedIngredients.includes(ing))
              setSelectedIngredients([...selectedIngredients, ing]);
            setFilterText("");
          }}
         testID="filter-add">
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
              setMaxTime(null);
              return;
            }
            const value = Number(text);
            setMaxTime(isNaN(value) ? null : value);
          }}
        />
      </View>

      <View style={styles.filterSection}>
        <TextInput
          style={styles.input}
          placeholder="Max price (€)"
          keyboardType="numeric"
          value={maxPrice?.toString() ?? ""}
          onChangeText={(text) => {
            if (text.trim() === "") {
              setMaxPrice(null);
              return;
            }
            const value = Number(text);
            setMaxPrice(isNaN(value) ? null : value);
          }}
        />
      </View>


      <View style={styles.selectedList}>
        {selectedIngredients.map((ing) => (
          <View key={ing} style={styles.selectedItem}>
            <Text>{ing}</Text>
            <TouchableOpacity
              onPress={() =>
                setSelectedIngredients(
                  selectedIngredients.filter((i) => i !== ing)
                )
              }
            >
              <Text style={styles.remove}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.container}
      >
        {filteredRecipes.map((recipe) => {
          const isExpanded = expandedIds.includes(recipe.id);
          return (
            <ExpandableRecipe
              key={recipe.id}
              recipe={recipe}
              isFavorite={favorites.includes(recipe.id)}
              onToggleFavorite={(id) => handleToggleFavorite(id)}
              showServingsControls={true}
              containerStyle={styles.recipeCard}
            />
          );
        })}
      </ScrollView>
      {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal} />}
    </View>
  );
}
