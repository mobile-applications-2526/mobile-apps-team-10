import { supabase } from "@/src/supabase/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCAL_FAVORITES_KEY = "favorites_local";
const PENDING_OPS_KEY = "favorites_pending_ops";

type PendingOp = { type: "add" | "remove"; recipeId: number };

export class FavoritesService {
  private async getPendingOps(): Promise<PendingOp[]> {
    const ops = await AsyncStorage.getItem(PENDING_OPS_KEY);
    return ops ? JSON.parse(ops) : [];
  }

  private async savePendingOps(ops: PendingOp[]) {
    await AsyncStorage.setItem(PENDING_OPS_KEY, JSON.stringify(ops));
  }

  private async updateLocal(recipeId: number, type: "add" | "remove") {
    const localRaw = await AsyncStorage.getItem(LOCAL_FAVORITES_KEY);
    let local: number[] = localRaw ? JSON.parse(localRaw) : [];

    if (type === "add" && !local.includes(recipeId)) local.push(recipeId);
    if (type === "remove") local = local.filter((id) => id !== recipeId);

    await AsyncStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(local));

    const pending = await this.getPendingOps();
    pending.push({ type, recipeId });
    await this.savePendingOps(pending);
  }

  async getFavorites(userId: string) {
    // E2E hook: browser only
    try {
      const win = typeof window !== "undefined" ? (window as any) : undefined;
      if (win && win.__E2E_FAVORITES && userId && win.__E2E_FAVORITES[userId]) {
        return win.__E2E_FAVORITES[userId];
      }
    } catch {}

    // 1. local storage (mobile)
    let local: number[] = [];
    try {
      const l = await AsyncStorage.getItem(LOCAL_FAVORITES_KEY);
      local = l ? JSON.parse(l) : [];
    } catch {}

    // 2. apply pending ops
    const pending = await this.getPendingOps();
    pending.forEach((op) => {
      if (op.type === "add" && !local.includes(op.recipeId)) local.push(op.recipeId);
      if (op.type === "remove") local = local.filter((id) => id !== op.recipeId);
    });

    return local;
  }

  async addFavorite(recipeId: number) {
    // E2E hook: browser only
    try {
      const win = typeof window !== "undefined" ? (window as any) : undefined;
      if (win && win.__E2E_USER) {
        const uid = win.__E2E_USER.id;
        win.__E2E_FAVORITES = win.__E2E_FAVORITES || {};
        win.__E2E_FAVORITES[uid] = win.__E2E_FAVORITES[uid] || [];
        if (!win.__E2E_FAVORITES[uid].includes(recipeId)) win.__E2E_FAVORITES[uid].push(recipeId);
        return;
      }
    } catch {}

    // Mobile / offline
    await this.updateLocal(recipeId, "add");
    await this.trySync();
  }

  async removeFavorite(recipeId: number) {
    // E2E hook: browser only
    try {
      const win = typeof window !== "undefined" ? (window as any) : undefined;
      if (win && win.__E2E_USER) {
        const uid = win.__E2E_USER.id;
        win.__E2E_FAVORITES = win.__E2E_FAVORITES || {};
        win.__E2E_FAVORITES[uid] = (win.__E2E_FAVORITES[uid] || []).filter((id: number) => id !== recipeId);
        return;
      }
    } catch {}

    // Mobile / offline
    await this.updateLocal(recipeId, "remove");
    await this.trySync();
  }

  async trySync() {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) return; // offline

    let pending = await this.getPendingOps();
    const remaining: PendingOp[] = [];

    for (const op of pending) {
      try {
        if (op.type === "add") {
          await supabase
            .from("favorites")
            .insert([{ user_id: user.id, recipe_id: op.recipeId }]);
        } else if (op.type === "remove") {
          await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("recipe_id", op.recipeId);
        }
      } catch {
        remaining.push(op);
      }
    }

    await this.savePendingOps(remaining);
  }
}

export default new FavoritesService();
