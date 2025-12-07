import { supabase } from "@/src/supabase/supabase";

export class FavoritesService {
  async getFavorites(userId: string) {
    const { data } = await supabase
      .from("favorites")
      .select("recipe_id")
      .eq("user_id", userId);

    return data?.map((f) => f.recipe_id) ?? [];
  }

  async addFavorite(recipeId: number) {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) throw new Error("Not logged in");

    const { error } = await supabase
      .from("favorites")
      .insert([{ user_id: user.id, recipe_id: recipeId }]);

    if (error) throw error;
  }

  async removeFavorite(recipeId: number): Promise<void> {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) throw new Error("Not logged in");

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("recipe_id", recipeId);
    if (error) throw error;
  }
}

export default new FavoritesService();
