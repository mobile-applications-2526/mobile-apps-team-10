import { useTheme } from "@/src/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Recipe } from "@types";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
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

interface Props {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  showServingsControls?: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
  titleStyle?: TextStyle;
  titleTestID?: string;
  descriptionStyle?: TextStyle;
  timeStyle?: TextStyle;
  subheadingStyle?: TextStyle;
  ingredientStyle?: TextStyle;
  stepStyle?: TextStyle;
  favoriteTestID?: string;
  ingredientsTestID?: string;
  wrapperTestID?: string;
}

export default function ExpandableRecipe({
  recipe,
  isFavorite = false,
  onToggleFavorite,
  showServingsControls = true,
  containerStyle,
  titleStyle,
  titleTestID,
  descriptionStyle,
  timeStyle,
  subheadingStyle,
  ingredientStyle,
  stepStyle,
  favoriteTestID,
  ingredientsTestID,
  wrapperTestID,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [servings, setServings] = useState<number>(1);

  const theme = useTheme();
  const styles = createExpandableStyles(theme as any);
  const toggleExpanded = () => setExpanded((s) => !s);

  const increase = () => setServings((s) => s + 1);
  const decrease = () => setServings((s) => Math.max(1, s - 1));

  const handleToggleFavorite = () => onToggleFavorite?.(recipe.id);

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

  return (
    <TouchableOpacity
      style={[styles.card, containerStyle]}
      onPress={toggleExpanded}
      testID={wrapperTestID}
      activeOpacity={1}
    >
      <View style={styles.rowBetween}>
        <Text testID={titleTestID} style={[styles.title, titleStyle]}>
          {recipe.title}
        </Text>
        <TouchableOpacity
          testID={favoriteTestID}
          onPress={handleToggleFavorite}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "red" : "black"}
          />
        </TouchableOpacity>
      </View>

      {recipe.description && (
        <Text style={[styles.description, descriptionStyle]}>
          {recipe.description}
        </Text>
      )}

      {recipe.time_minutes !== null && (
        <Text style={[styles.time, timeStyle]}>
          ⏱ {recipe.time_minutes} min
        </Text>
      )}

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

          <Text style={[styles.subheading, subheadingStyle]}>Ingredients:</Text>
          <View testID={ingredientsTestID}>
            {recipe.recipe_ingredients.map((ri) => {
              const scaled = ri.quantity * servings;
              return (
                <View key={ri.ingredient_id} style={styles.ingredientRow}>
                  <Text style={[styles.ingredientText, ingredientStyle]}>
                    {formatQuantity(scaled)} {ri.unit} {ri.ingredients.name} (€
                    {calculateIngredientPrice(ri).toFixed(2)})
                  </Text>
                </View>
              );
            })}
          </View>

          <Text style={[styles.subheading, subheadingStyle]}>Steps:</Text>
          {recipe.steps.map((step, index) => (
            <Text key={index} style={[styles.step, stepStyle]}>
              {index + 1}. {step}
            </Text>
          ))}

          <Link
            href={`/recipes/${recipe.id}`}
            asChild
            style={styles.goToRecipeButton}
          >
            <Pressable>
              <Text>View Details</Text>
            </Pressable>
          </Link>
        </View>
      )}
    </TouchableOpacity>
  );
}
