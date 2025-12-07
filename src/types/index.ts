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
