import { Recipe } from "@types";

const UNIT_MULTIPLIERS: Record<string, number> = {
  g: 1 / 100,
  grams: 1 / 100,
  tbsp: 1 / 16,
  tsp: 1 / 5,
  pcs: 1,
  whole: 1,
  medium: 1,
  cloves: 0.05,
  leaves: 0.01,
};

export const calculateRecipePrice = (
  recipe: Recipe,
  servings: number = 1
): number => {
  return recipe.recipe_ingredients.reduce((total, ri) => {
    const unit = ri.unit.toLowerCase();
    const multiplier = UNIT_MULTIPLIERS[unit] ?? 1;

    return (
      total +
      ri.ingredients.price_per_unit *
        ri.quantity *
        servings *
        multiplier
    );
  }, 0);
};
