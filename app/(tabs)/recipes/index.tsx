import ExpandableRecipe from "@/src/components/ExpandableRecipe";
import { useFavorites } from "@/src/context/FavoritesContext";
import { useTheme } from "@/src/hooks/useTheme";
import {
  generateRecipe,
  saveGeneratedRecipe,
} from "@/src/services/recipeGeneration.service";
import RecipesService from "@/src/services/recipes.service";
import SessionService from "@/src/services/session.service";
import { createRecipeStyles } from "@/src/styles/recipes.styles";
import { User } from "@supabase/supabase-js";
import { Recipe } from "@types";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
  const [showFilters, setShowFilters] = useState(false);

  const [generating, setGenerating] = useState(false);

  const PAGE_SIZE = 10;

  const [page, setPage] = useState(1);

  const theme = useTheme();
  const styles = createRecipeStyles(theme as any);

  useEffect(() => {
    const load = async () => {
      const { data } = await SessionService.getSession();
      try {
        // @ts-ignore
        const win = typeof window !== "undefined" ? (window as any) : undefined;
        const e2eUser = win && win.__E2E_USER ? win.__E2E_USER : null;
        setUser(data.session?.user ?? e2eUser ?? null);
      } catch {
        setUser(data.session?.user ?? null);
      }
    };
    load();

    const { data: listener } = SessionService.onAuthStateChange(
      (_event, session) => {
        try {
          // @ts-ignore
          const win =
            typeof window !== "undefined" ? (window as any) : undefined;
          const e2eUser = win && win.__E2E_USER ? win.__E2E_USER : null;
          setUser(session?.user ?? e2eUser ?? null);
        } catch {
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

  const handleAddIngredient = () => {
    const ing = filterText.trim().toLowerCase();
    if (ing && !selectedIngredients.includes(ing)) {
      setSelectedIngredients([...selectedIngredients, ing]);
    }
    setFilterText("");
  };

  // Refresh recipes when screen is focused
  // This is useful when coming back from recipe details screen
  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [])
  );

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
    setPage(1);
  }, [selectedIngredients, maxTime, maxPrice, recipes]);

  const handleToggleFavorite = async (id: number) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    await toggleFavorite(id);
  };

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const handleGenerate = async () => {
    if (selectedIngredients.length === 0) return;
    setGenerating(true);
    setErrorMsg(null);
    try {
      const generated = await generateRecipe(selectedIngredients);
      const savedRecipe = await saveGeneratedRecipe(generated);
      router.push(`/recipes/${savedRecipe.id}`);
    } catch (err: any) {
      console.error("Generation or save failed:", err);
      setErrorMsg(
        err.message || "Something went wrong while saving the recipe."
      );
    } finally {
      setGenerating(false);
    }
  };
  const visibleRecipes = filteredRecipes.slice(0, page * PAGE_SIZE);
  const hasMore = visibleRecipes.length < filteredRecipes.length;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Recipes</Text>
        </View>

        <View style={styles.filterSection}>
          <TextInput
            style={styles.input}
            placeholder="Enter ingredient..."
            placeholderTextColor={theme.colors.placeholder}
            value={filterText}
            onChangeText={setFilterText}
            onSubmitEditing={handleAddIngredient}
            returnKeyType="done"
            submitBehavior="submit"
            testID="filter-input"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddIngredient}
            testID="filter-add"
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterSection}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowFilters((s) => !s)}
            testID="advanced-filters-toggle"
          >
            <Text style={styles.addButtonText}>
              {`Show filters ${showFilters ? "−" : "+"}`}
            </Text>
          </TouchableOpacity>
        </View>

        {showFilters ? (
          <>
            <View style={styles.filterSection}>
              <TextInput
                style={styles.input}
                placeholder="Max time (minutes)"
                placeholderTextColor={theme.colors.placeholder}
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
                placeholderTextColor={theme.colors.placeholder}
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
          </>
        ) : null}
        <View style={styles.selectedList}>
          {selectedIngredients.map((ing) => (
            <TouchableOpacity
              key={ing}
              style={styles.selectedItem}
              onPress={() =>
                setSelectedIngredients(
                  selectedIngredients.filter((i) => i !== ing)
                )
              }
            >
              <Text style={{ color: theme.colors.text }}>{ing}</Text>
              <TouchableOpacity>
                <Text style={styles.remove}>X</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.container}
        >
          {generating || loading ? (
            <View
              style={{
                zIndex: 999,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  padding: 30,
                  backgroundColor: theme.colors.background,
                  elevation: 5,
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color={theme.colors.accent} />
                {/* Use your primary brand color */}
                <Text
                  style={{
                    marginTop: 15,
                    fontSize: 16,
                    fontWeight: "600",
                    color: theme.colors.text,
                  }}
                >
                  {generating
                    ? "Let 'm Cook is thinking..."
                    : "Loading Recipes..."}
                </Text>
              </View>
            </View>
          ) : null}
          {errorMsg ? (
            <View
              style={{
                backgroundColor: theme.colors.errorBackground,
                borderWidth: 1,
                borderColor: theme.colors.errorBorder,
                padding: 12,
                marginHorizontal: 16,
                marginBottom: 16,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ color: theme.colors.errorText, flex: 1 }}>
                {errorMsg}
              </Text>
              <TouchableOpacity onPress={() => setErrorMsg(null)}>
                <Text
                  style={{
                    fontWeight: "bold",
                    marginLeft: 10,
                    color: theme.colors.errorText,
                  }}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {filteredRecipes.length < 5 && !loading && !generating ? (
            <TouchableOpacity
              style={[styles.generateButton]}
              disabled={selectedIngredients.length === 0}
              onPress={handleGenerate}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>
                Don't find what you're looking for? Generate a recipe with AI!
              </Text>
            </TouchableOpacity>
          ) : null}

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
                titleTestID={`recipe-title-${recipe.id}`}
                favoriteTestID={`recipe-fav-button-${recipe.id}`}
                wrapperTestID={`recipe-wrapper-${recipe.id}`}
                ingredientsTestID={`recipe-ingredients-${recipe.id}`}
              />
            );
          })}

          {visibleRecipes.map((recipe) => {
            const isExpanded = expandedIds.includes(recipe.id);
            return (
              <ExpandableRecipe
                key={recipe.id}
                recipe={recipe}
                isFavorite={favorites.includes(recipe.id)}
                onToggleFavorite={(id) => handleToggleFavorite(id)}
                showServingsControls={true}
                containerStyle={styles.recipeCard}
                titleTestID={`recipe-title-${recipe.id}`}
                favoriteTestID={`recipe-fav-button-${recipe.id}`}
                wrapperTestID={`recipe-wrapper-${recipe.id}`}
                ingredientsTestID={`recipe-ingredients-${recipe.id}`}
              />
            );
          })}

          {hasMore && !loading && (
            <TouchableOpacity
              style={[styles.generateButton, { marginTop: 16 }]}
              onPress={() => setPage((p) => p + 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>Load more recipes</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {showLoginModal ? (
          <LoginModal setShowLoginModal={setShowLoginModal} />
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}
