import RecipesService from "@/src/services/recipes.service";
import theme from "@/src/styles/theme";
import { Recipe } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const recipeId = Number(id);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const all = await RecipesService.fetchAll();
      setRecipe(all.find((r) => r.id === recipeId) || null);
      setLoading(false);
    };
    load();
  }, [recipeId]);

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );

  if (!recipe)
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18 }}>Recipe not found.</Text>
      </View>
    );

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text
        style={{
          fontSize: theme.fontSizes.xl,
          fontWeight: theme.fontWeights.extra,
          marginBottom: theme.spacing.sm,
          color: theme.colors.text,
        }}
      >
        {recipe.title}
      </Text>

      {recipe.description && (
        <Text
          style={{
            fontSize: theme.fontSizes.md,
            color: theme.colors.text,
            opacity: 0.7,
            marginBottom: theme.spacing.md,
            lineHeight: 22,
          }}
        >
          {recipe.description}
        </Text>
      )}

      {recipe.time_minutes !== null && recipe.time_minutes !== undefined && (
        <Text
          style={{
            fontSize: theme.fontSizes.md,
            color: theme.colors.text,
            opacity: 0.7,
            marginBottom: theme.spacing.md,
          }}
        >
          ⏱ {recipe.time_minutes} minutes
        </Text>
      )}

    </ScrollView>
  );
}
