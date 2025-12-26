import { useTheme } from "@/src/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Recipe } from "@types";
import React, { useEffect, useState } from "react";
import {
  GestureResponderEvent,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { createExpandableStyles } from "../styles/expandable.styles";

/**
 * Unit → pricing multiplier
 * Assumption:
 * - price_per_unit is per 100g OR per piece depending on ingredient
 */
const UNIT_MULTIPLIERS: Record<string, number> = {
  // weight
  g: 1 / 100,
  grams: 1 / 100,

  // volume (approximate, in grams)
  tbsp: 1 / 16,
  tsp: 1 / 5,

  // pieces
  pcs: 1,
  whole: 1,
  medium: 1,

  // special culinary units
  cloves: 0.05, // ~5g
  leaves: 0.01, // ~1g
};

interface Props {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  showServingsControls?: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
  titleStyle?: TextStyle;
  /** testID to apply to the title Text element (useful for E2E) */
  titleTestID?: string;
  descriptionStyle?: TextStyle;
  timeStyle?: TextStyle;
  subheadingStyle?: TextStyle;
  ingredientStyle?: TextStyle;
  stepStyle?: TextStyle;
  /** testID to apply to the favorite toggle button */
  favoriteTestID?: string;
}

export default function ExpandableRecipe({
  recipe,
  isFavorite = false,
  onToggleFavorite,
  showServingsControls = true,
  containerStyle,
  titleStyle,
  /** optional testID applied to title text */
  titleTestID,
  descriptionStyle,
  timeStyle,
  subheadingStyle,
  ingredientStyle,
  stepStyle,
  /** optional testID applied to favorite button */
  favoriteTestID,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [servings, setServings] = useState<number>(1);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  const storageKey = `checklist:${recipe.id}`;

  const theme = useTheme();
  const styles = createExpandableStyles(theme as any);

  useEffect(() => {
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem(storageKey);
        if (raw) setCheckedIds(JSON.parse(raw));
      }
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(checkedIds));
      }
    } catch {}
  }, [checkedIds, storageKey]);

  const toggleChecked = (ingredientId: number, e?: GestureResponderEvent) => {
    e?.stopPropagation();
    setCheckedIds((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const toggleExpanded = () => setExpanded((s) => !s);

  const increase = (e?: GestureResponderEvent) => {
    e?.stopPropagation();
    setServings((s) => s + 1);
    setCheckedIds([]);
  };

  const decrease = (e?: GestureResponderEvent) => {
    e?.stopPropagation();
    setServings((s) => Math.max(1, s - 1));
    setCheckedIds([]);
  };

  const handleToggleFavorite = (e?: GestureResponderEvent) => {
    e?.stopPropagation();
    onToggleFavorite?.(recipe.id);
  };

  const formatQuantity = (value: number) => {
    if (Number.isInteger(value)) return value.toString();
    const rounded = Math.round(value * 100) / 100;
    return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toString();
  };

  /** ✅ Price calculation per ingredient (unit-aware) */
  const calculateIngredientPrice = (ri: any) => {
    const unit = ri.unit.toLowerCase();
    const multiplier = UNIT_MULTIPLIERS[unit] ?? 1;
    const scaledQuantity = ri.quantity * servings;

    return ri.ingredients.price_per_unit * scaledQuantity * multiplier;
  };

  /** ✅ Total recipe price */
  const calculateTotalPrice = () => {
    return recipe.recipe_ingredients.reduce(
      (total, ri) => total + calculateIngredientPrice(ri),
      0
    );
  };

  const formatPrice = (value: number) => `€${value.toFixed(2)}`;

  return (
    <TouchableOpacity
      style={[styles.card, containerStyle]}
      onPress={toggleExpanded}
    >
      <View style={styles.rowBetween}>
        <Text testID={titleTestID} style={[styles.title, titleStyle]}>{recipe.title}</Text>
        <TouchableOpacity testID={favoriteTestID} onPress={handleToggleFavorite}>
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

      {expanded && (
        <View style={styles.expandedSection}>
          {showServingsControls && (
            <View style={styles.servingsRow}>
              <Text style={[styles.personsLabel, subheadingStyle]}>
                Persons:
              </Text>
              <TouchableOpacity
                onPress={decrease}
                style={styles.servingsButton}
              >
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

          <Text style={[styles.subheading, subheadingStyle]}>
            Ingredients:
          </Text>

          {recipe.recipe_ingredients.map((ri) => {
            const scaled = ri.quantity * servings;
            const checked = checkedIds.includes(ri.ingredient_id);

            return (
              <View key={ri.ingredient_id} style={styles.ingredientRow}>
                <TouchableOpacity
                  onPress={(e) => toggleChecked(ri.ingredient_id, e)}
                  style={styles.checkboxTouchable}
                >
                  <Ionicons
                    name={checked ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    color={checked ? "green" : "gray"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={(e) => toggleChecked(ri.ingredient_id, e)}
                  style={{ flex: 1 }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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

          <Text style={[styles.subheading, subheadingStyle]}>Steps:</Text>
          {recipe.steps.map((step, index) => (
            <Text key={index} style={[styles.step, stepStyle]}>
              {index + 1}. {step}
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}
