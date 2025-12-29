import LoginModal from "@/app/(modals)/LoginModal";
import { useTheme } from "@/src/hooks/useTheme";
import SessionService from "@/src/services/session.service";
import { createFullRecipeStyles } from "@/src/styles/fullRecipe.styles";
import { Recipe } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useFavorites } from "../context/FavoritesContext";
import { useRecipeChecklist } from "../hooks/useRecipeChecklist";

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
export interface FullRecipeProps {
  recipe: Recipe;
  showServingsControls?: boolean;
  subheadingStyle?: object;
  stepStyle?: object;
  onToggleFavorite?: (id: number) => void;
  isFavorite?: boolean;
  titleStyle?: object;
  descriptionStyle?: object;
  timeStyle?: object;
  titleTestID?: string;
}

export default function FullRecipe({
  recipe,
  showServingsControls = true,
  subheadingStyle,
  stepStyle,
  onToggleFavorite,
  isFavorite = false,
  titleStyle,
  descriptionStyle,
  timeStyle,
  titleTestID,
}: FullRecipeProps) {
  const theme = useTheme();
  const styles = createFullRecipeStyles(theme);

  const [servings, setServings] = useState<number>(1);

  const ingredientsChecklist = useRecipeChecklist(recipe.id, "ingredients");
  const stepsChecklist = useRecipeChecklist(recipe.id, "steps");

  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await SessionService.getSession();
      // E2E fallback
      try {
        // @ts-ignore
        const win = typeof window !== "undefined" ? (window as any) : undefined;
        const e2eUser = win && win.__E2E_USER ? win.__E2E_USER : null;
        setUser(data.session?.user ?? e2eUser ?? null);
      } catch (e) {
        setUser(data.session?.user ?? null);
      }
    };
    load();
    const { data: listener } = SessionService.onAuthStateChange(
      (_event, session) => {
        try {
          // @ts-ignore
          const win =
            typeof window !== "undefined" ? (window as any) : undefined;
          const e2eUser = win && win.__E2E_USER ? win.__E2E_USER : null;
          setUser(session?.user ?? e2eUser ?? null);
        } catch (e) {
          setUser(session?.user ?? null);
        }
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const increase = () => {
    setServings((s) => s + 1);
    ingredientsChecklist.reset();
  };

  const decrease = () => {
    setServings((s) => Math.max(1, s - 1));
    ingredientsChecklist.reset();
  };

  const formatQuantity = (value: number) => {
    if (Number.isInteger(value)) return value.toString();
    const rounded = Math.round(value * 100) / 100;
    return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toString();
  };

  const calculateIngredientPrice = (ri: any) => {
    const unit = ri.unit.toLowerCase();
    const multiplier = UNIT_MULTIPLIERS[unit] ?? 1;
    const scaledQuantity = ri.quantity * servings;

    return ri.ingredients.price_per_unit * scaledQuantity * multiplier;
  };

  const calculateTotalPrice = () => {
    return recipe.recipe_ingredients.reduce(
      (total, ri) => total + calculateIngredientPrice(ri),
      0
    );
  };

  const formatPrice = (value: number) => `€${value.toFixed(2)}`;
  const { favorites, toggleFavorite, refreshFavorites } = useFavorites();

  const handleToggleFavorite = async (id: number) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    await toggleFavorite(id);
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.content}>
        <View style={styles.rowBetween}>
          <Text testID={titleTestID} style={[styles.title, titleStyle]}>
            {recipe.title}
          </Text>
          <TouchableOpacity
            testID={recipe.id.toString() + "-fav-button"}
            onPress={() => handleToggleFavorite(recipe.id)}
            style={{ marginTop: 40, marginRight: 4 }}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "red" : "black"}
            />
          </TouchableOpacity>
        </View>

        {recipe.description ? (
          <Text style={[styles.description, descriptionStyle]}>
            {recipe.description}
          </Text>
        ) : null}

        {recipe.time_minutes !== null && (
          <Text style={[styles.time, timeStyle]}>
            ⏱ {recipe.time_minutes} min
          </Text>
        )}

        {/* ✅ Total price */}
        <Text style={[styles.time, timeStyle]}>
          💰 {formatPrice(calculateTotalPrice())}
        </Text>
        {showServingsControls && (
          <View style={styles.servingsRow}>
            <Text style={[styles.personsLabel, subheadingStyle]}>Persons:</Text>
            <TouchableOpacity onPress={decrease} style={styles.servingsButton}>
              <Text style={styles.servingsButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.servingsCount}>
              <Text style={styles.servingsButtonText}>{servings}</Text>
            </View>
            <TouchableOpacity
              onPress={increase}
              style={[styles.servingsButton, { marginLeft: 8 }]}
            >
              <Text style={styles.servingsButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={[styles.subheading, subheadingStyle]}>Ingredients:</Text>

        <View testID={recipe.id.toString()}>
          {recipe.recipe_ingredients.map((ri) => {
            const scaled = ri.quantity * servings;
            const checked = ingredientsChecklist.checked.includes(
              ri.ingredient_id
            );

            return (
              <View key={ri.ingredient_id} style={styles.ingredientRow}>
                <TouchableOpacity
                  onPress={() => ingredientsChecklist.toggle(ri.ingredient_id)}
                  style={styles.checkboxTouchable}
                >
                  <Ionicons
                    name={checked ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    color={checked ? "green" : "gray"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => ingredientsChecklist.toggle(ri.ingredient_id)}
                  style={{ flex: 1 }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        styles.ingredientText,
                        checked ? styles.ingredientChecked : null,
                      ]}
                    >
                      {formatQuantity(scaled)} {ri.unit} {ri.ingredients.name}
                    </Text>

                    <Text style={{ color: "#666", fontSize: 13 }}>
                      €{calculateIngredientPrice(ri).toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <Text style={[styles.subheading, subheadingStyle]}>Steps:</Text>
        {recipe.steps.map((step, index) => {
          const checked = stepsChecklist.checked.includes(index);

          return (
            <View key={index} style={styles.stepRow}>
              <TouchableOpacity
                onPress={() => stepsChecklist.toggle(index)}
                style={styles.checkboxTouchable}
              >
                <Ionicons
                  name={checked ? "checkmark-circle" : "ellipse-outline"}
                  size={20}
                  color={checked ? "green" : "gray"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => stepsChecklist.toggle(index)}
                style={{ flex: 1 }}
              >
                <Text
                  style={[
                    styles.step,
                    stepStyle,
                    checked && styles.stepChecked,
                  ]}
                >
                  {index + 1}. {step}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal} />}
    </View>
  );
}
