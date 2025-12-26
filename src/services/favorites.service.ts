import { supabase } from "@/src/supabase/supabase";

export class FavoritesService {
  async getFavorites(userId: string) {
    // E2E hook: read favorites from window.__E2E_FAVORITES if present (fast, deterministic for tests)
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const win = typeof window !== 'undefined' ? (window as any) : undefined;
      if (win && win.__E2E_FAVORITES && userId && win.__E2E_FAVORITES[userId]) {
        return win.__E2E_FAVORITES[userId];
      }
    } catch (e) {
      // ignore in non-browser env
    }
    const { data } = await supabase
      .from("favorites")
      .select("recipe_id")
      .eq("user_id", userId);

    return data?.map((f) => f.recipe_id) ?? [];
  }

  async addFavorite(recipeId: number) {
    // E2E hook: mutate window.__E2E_FAVORITES if present
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const win = typeof window !== 'undefined' ? (window as any) : undefined;
      if (win && win.__E2E_USER) {
        const uid = win.__E2E_USER.id;
        win.__E2E_FAVORITES = win.__E2E_FAVORITES || {};
        win.__E2E_FAVORITES[uid] = win.__E2E_FAVORITES[uid] || [];
        if (!win.__E2E_FAVORITES[uid].includes(recipeId)) win.__E2E_FAVORITES[uid].push(recipeId);
        return;
      }
    } catch (e) {
      // ignore
    }

    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) throw new Error("Not logged in");

    const { error } = await supabase
      .from("favorites")
      .insert([{ user_id: user.id, recipe_id: recipeId }]);

    if (error) throw error;
  }

  async removeFavorite(recipeId: number): Promise<void> {
    // E2E hook: mutate window.__E2E_FAVORITES if present
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const win = typeof window !== 'undefined' ? (window as any) : undefined;
      if (win && win.__E2E_USER) {
        const uid = win.__E2E_USER.id;
        win.__E2E_FAVORITES = win.__E2E_FAVORITES || {};
        win.__E2E_FAVORITES[uid] = (win.__E2E_FAVORITES[uid] || []).filter((id: number) => id !== recipeId);
        return;
      }
    } catch (e) {
      // ignore
    }

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
