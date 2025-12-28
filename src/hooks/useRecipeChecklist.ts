import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useRecipeChecklist(
  recipeId: number,
  type: "ingredients" | "steps"
) {
  const key = `recipe:${recipeId}:${type}`;
  const [checked, setChecked] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(key).then((raw) => {
      if (raw) setChecked(JSON.parse(raw));
      setLoaded(true);
    });
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(key, JSON.stringify(checked));
  }, [checked, key, loaded]);

  const toggle = (id: number) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const reset = () => setChecked([]);

  return { checked, toggle, reset };
}
