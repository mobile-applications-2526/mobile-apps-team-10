import { supabase } from "@/src/supabase/supabase";
import { Recipe } from "../types";
import { calculateRecipePrice } from "@/src/utils/pricing";
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
          ingredients (name, price_per_unit)
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

filterByMaxPrice(
  recipes: Recipe[],
  maxPrice: number | null,
  servings: number = 1
): Recipe[] {
  if (maxPrice === null) return recipes;

  return recipes.filter(
    (recipe) => calculateRecipePrice(recipe, servings) <= maxPrice
  );
}


  filterByIngredients(
    recipes: Recipe[],
    selectedIngredients: string[]
  ): Recipe[] {
    if (!selectedIngredients || selectedIngredients.length === 0)
      return recipes;

    return recipes.filter((recipe) =>
    selectedIngredients.every((ing) => {
      const needle = ing.toLowerCase();

      const matchesIngredient = recipe.recipe_ingredients.some((ri) =>
        ri.ingredients.name.toLowerCase().includes(needle)
      );

      const matchesTitle = recipe.title
        ?.toLowerCase()
        .includes(needle);

      return matchesIngredient || matchesTitle;
    })
    );
  }
}

export default new RecipesService();
