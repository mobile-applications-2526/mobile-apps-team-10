import FullRecipe from "@/src/components/FullRecipe";
import { useTheme } from "@/src/hooks/useTheme";
import recipesService from "@/src/services/recipes.service";
import { createRecipeStyles } from "@/src/styles/recipes.styles";
import { Recipe } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function RecipePage() {
  const { id } = useLocalSearchParams();
  const recipeId = Number(id);

  const theme = useTheme();
  const styles = createRecipeStyles(theme);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const all = await recipesService.fetchAll();
      setRecipe(all.find((r) => r.id === recipeId) || null);
      setLoading(false);
    };

    load();
  }, [recipeId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Recipes</Text>
        </View>
        <Text style={styles.loading}>Recipe not found.</Text>
      </View>
    );
  }

  return <FullRecipe recipe={recipe} />;
}
