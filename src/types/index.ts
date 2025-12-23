export type Ingredient = {
id: number;
name: string;
price_per_unit: number;
};

export type RecipeIngredient = {
  ingredient_id: number;
  quantity: number;
  unit: string;
  ingredients: Ingredient;
};

export type Recipe = {
  id: number;
  title: string;
  description: string;
  steps: string[];
  time_minutes: number | null;
  recipe_ingredients: RecipeIngredient[];
};
