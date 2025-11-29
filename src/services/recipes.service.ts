import { supabase } from "@/src/supabase/supabase";

export type Ingredient = {
  ingredient_id: number;
  quantity: number;
  unit: string;
  ingredients: { name: string };
};

export type Recipe = {
  id: number;
  title: string;
  description: string;
  steps: string[];
  recipe_ingredients: Ingredient[];
};

export class RecipesService {
  async fetchAll(): Promise<Recipe[]> {
    const { data, error } = await supabase.from("recipes").select(`
        id,
        title,
        description,
        steps,
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

    return (data as Recipe[]) ?? [];
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
