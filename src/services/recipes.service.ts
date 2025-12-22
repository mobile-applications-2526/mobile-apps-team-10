import { supabase } from "@/src/supabase/supabase";
import { Recipe } from "../types";
export class RecipesService {
  async fetchAll(): Promise<Recipe[]> {
    const { data, error } = await supabase.from("recipes").select(`
        id,
        title,
        description,
        steps,
        time_minutes,
        recipe_ingredients (
          quantity,
          unit,
          ingredient_id,
          ingredients (name)
        )
      `);

    if (error) {
      throw error;
    }

    return (data as unknown as Recipe[]) ?? [];
  }

  filterByTime(recipes: Recipe[], maxTime: number | null): Recipe[] {
  if (maxTime === null) return recipes;

  return recipes.filter(
    (recipe) =>
      recipe.time_minutes !== null &&
      recipe.time_minutes <= maxTime
  );
}

  filterByIngredients(
    recipes: Recipe[],
    selectedIngredients: string[]
  ): Recipe[] {
    if (!selectedIngredients || selectedIngredients.length === 0)
      return recipes;

    return recipes.filter((recipe) =>
      selectedIngredients.every((ing) =>
        recipe.recipe_ingredients.some((ri) =>
          ri.ingredients.name.toLowerCase().includes(ing.toLowerCase())
        )
      )
    );
  }
}

export default new RecipesService();
