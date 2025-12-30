import { supabase } from "../supabase/supabase";

export const generateRecipe = async (ingredients: string[]) => {
const res = await fetch(
`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/generate-recipe`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
},
body: JSON.stringify({ ingredients }),
    }
  );

  if (!res.ok) throw new Error("Recipe generation failed");

  const text = await res.text();
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`Invalid JSON response: ${text}`);
  }
};

interface GeneratedIngredient {
  name: string;
  quantity: number | string;
  unit: string;
  price_estimate?: number;
}

type GeneratedRecipe = {
  title: string;
  description: string;
  steps: string[];
  ingredients: (string | GeneratedIngredient)[];
  cookingTimeMinutes: number;
};

export const saveGeneratedRecipe = async (recipe: GeneratedRecipe) => {
  try {
    console.log("--- DEBUG START ---");
    console.log("1. Raw AI Data:", JSON.stringify(recipe, null, 2));

    // 1️⃣ Sanitize + normalize ingredients
    const sanitizedIngredients = (recipe.ingredients || []).map((ing, index) => {
      if (typeof ing === "string") {
        const parts = ing.trim().split(" ");
        const quantity = parseFloat(parts[0]) || 1;
        const hasUnit = parts.length > 2;
        const unit = hasUnit ? parts[1].toLowerCase() : "unit";
        const name = hasUnit
          ? parts.slice(2).join(" ")
          : parts.slice(1).join(" ") || ing;

        return {
          name: name.toLowerCase().trim(),
          quantity,
          unit,
          price_estimate: 0,
        };
      }

      return {
        name: (ing.name || "unknown").toLowerCase().trim(),
        quantity: Number(ing.quantity) || 1,
        unit: (ing.unit || "unit").toLowerCase().trim(),
        price_estimate: Number(ing.price_estimate || 0),
      };
    });

    console.log("2. Sanitized Data:", sanitizedIngredients);

    // 2️⃣ Insert Recipe
    const { data: newRecipe, error: recipeError } = await supabase
      .from("recipes")
      .insert([
        {
          title: recipe.title || "Untitled Recipe",
          description: recipe.description || "No description",
          steps: recipe.steps || [],
          time_minutes: recipe.cookingTimeMinutes || 30,
        },
      ])
      .select()
      .single();

    if (recipeError) throw recipeError;

    // 3️⃣ Fetch existing ingredients (case-insensitive via lowercase)
    const ingredientNames = sanitizedIngredients.map((i) => i.name);

    const { data: existingIngredients, error: fetchError } = await supabase
      .from("ingredients")
      .select("id, name, price_per_unit")
      .in("name", ingredientNames);

    if (fetchError) throw fetchError;

    const existingMap = Object.fromEntries(
      (existingIngredients || []).map((i) => [i.name, i])
    );

    // 4️⃣ Insert ONLY new ingredients
    const newIngredients = sanitizedIngredients.filter(
      (i) => !existingMap[i.name]
    );

    let insertedIngredients: any[] = [];

    if (newIngredients.length > 0) {
      const { data, error } = await supabase
        .from("ingredients")
        .insert(
          newIngredients.map((i) => ({
            name: i.name, // already lowercase
            price_per_unit: i.price_estimate,
          }))
)
.select();

      if (error) throw error;
      insertedIngredients = data ?? [];
    }

    // 5️⃣ Merge ingredient sources (DB price wins)
    const allIngredients = [
      ...(existingIngredients || []),
      ...insertedIngredients,
    ];

    const ingredientMap = Object.fromEntries(
      allIngredients.map((i) => [i.name, i.id])
    );

    // 6️⃣ Insert join table
    const joinInserts = sanitizedIngredients.map((i) => ({
      recipe_id: newRecipe.id,
      ingredient_id: ingredientMap[i.name],
      quantity: i.quantity,
      unit: i.unit,
    }));

    await supabase.from("recipe_ingredients").insert(joinInserts);

    console.log("✅ Success!");
    return newRecipe;
  } catch (err: any) {
    console.error("❌ CRITICAL SAVE FAILURE:", err.message);
    throw err;
  }
};
