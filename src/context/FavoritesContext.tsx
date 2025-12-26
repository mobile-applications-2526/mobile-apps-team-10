import FavoritesService from '@/src/services/favorites.service';
import { supabase } from '@/src/supabase/supabase';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (id: number) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      // fallback to E2E user for tests
      try {
        // @ts-ignore
        const win = typeof window !== 'undefined' ? (window as any) : undefined;
        const e2eId = win && win.__E2E_USER?.id;
        setUserId(data.user?.id ?? e2eId ?? null);
      } catch (e) {
        setUserId(data.user?.id ?? null);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      try {
        // @ts-ignore
        const win = typeof window !== 'undefined' ? (window as any) : undefined;
        const e2eId = win && win.__E2E_USER?.id;
        setUserId(session?.user?.id ?? e2eId ?? null);
      } catch (e) {
        setUserId(session?.user?.id ?? null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) refreshFavorites();
    else setFavorites([]);
  }, [userId]);

  const refreshFavorites = async () => {
    if (!userId) return;
    const favs = await FavoritesService.getFavorites(userId);
    setFavorites(favs);
  };

  const toggleFavorite = async (id: number) => {
    if (!userId) return;
    const isFav = favorites.includes(id);

    const previous = [...favorites];
    try {
      if (isFav) {
        setFavorites(prev => prev.filter(f => f !== id));
        await FavoritesService.removeFavorite(id);
      } else {
        setFavorites(prev => [...prev, id]);
        await FavoritesService.addFavorite(id);
      }
    } catch (err) {
      setFavorites(previous);
      console.error("Sync error:", err);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, refreshFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
};