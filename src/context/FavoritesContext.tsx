import FavoritesService from "@/src/services/favorites.service";
import { supabase } from "@/src/supabase/supabase";
import React, { createContext, useContext, useEffect, useState } from "react";

interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (id: number) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Try to read supabase user, but fall back to the E2E window user if present (used by Cypress)
    const init = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const uid = data?.user?.id ?? null;
        // E2E fallback
        try {
          // @ts-ignore
          const win = typeof window !== "undefined" ? (window as any) : undefined;
          const e2eUid = win && win.__E2E_USER ? win.__E2E_USER.id : null;
          setUserId(uid ?? e2eUid ?? null);
        } catch (e) {
          setUserId(uid ?? null);
        }
      } catch (err) {
        // If supabase fails, still try the E2E window user
        try {
          // @ts-ignore
          const win = typeof window !== "undefined" ? (window as any) : undefined;
          const e2eUid = win && win.__E2E_USER ? win.__E2E_USER.id : null;
          setUserId(e2eUid ?? null);
        } catch (e) {
          setUserId(null);
        }
      }

      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          try {
            // @ts-ignore
            const win = typeof window !== "undefined" ? (window as any) : undefined;
            const e2eUid = win && win.__E2E_USER ? win.__E2E_USER.id : null;
            setUserId(session?.user?.id ?? e2eUid ?? null);
          } catch (e) {
            setUserId(session?.user?.id ?? null);
          }
        }
      );

      return () => listener.subscription.unsubscribe();
    };

    // Call and allow cleanup to be returned from effect
    const cleanupPromise = init();
    return () => {
      // If the init function returned a cleanup, call it
      cleanupPromise.then((maybeCleanup: any) => {
        if (typeof maybeCleanup === "function") maybeCleanup();
      });
    };
  }, []);

  useEffect(() => {
    if (userId) refreshFavorites();
    else setFavorites([]);
  }, [userId]);

  const refreshFavorites = async () => {
    if (!userId) return;
    try {
      const favs = await FavoritesService.getFavorites(userId);
      setFavorites(favs);
    } catch (err) {
      console.warn("Failed to refresh favorites:", err);
      setFavorites([]); // fallback
    }
  };

  const toggleFavorite = async (id: number) => {
    if (!userId) return;
    const isFav = favorites.includes(id);

    const previous = [...favorites];
    try {
      if (isFav) {
        setFavorites((prev) => prev.filter((f) => f !== id));
        await FavoritesService.removeFavorite(id);
      } else {
        setFavorites((prev) => [...prev, id]);
        await FavoritesService.addFavorite(id);
      }
    } catch (err) {
      setFavorites(previous);
      console.error("Sync error:", err);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, refreshFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
};
