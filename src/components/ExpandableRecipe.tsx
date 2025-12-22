import React, { useState } from "react";
import { Recipe } from "@types";
import { View, Text, TouchableOpacity, ViewStyle, TextStyle, GestureResponderEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { expandableStyles as styles } from "@/src/styles/expandable.styles";

interface Props {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  showServingsControls?: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  timeStyle?: TextStyle;
  subheadingStyle?: TextStyle;
  ingredientStyle?: TextStyle;
  stepStyle?: TextStyle;
}

export default function ExpandableRecipe({
  recipe,
  isFavorite = false,
  onToggleFavorite,
  showServingsControls = true,
  containerStyle,
  titleStyle,
  descriptionStyle,
  timeStyle,
  subheadingStyle,
  ingredientStyle,
  stepStyle,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [servings, setServings] = useState<number>(1);

  const toggleExpanded = () => setExpanded((s) => !s);
  const increase = (e?: GestureResponderEvent) => {
    e?.stopPropagation();
    setServings((s) => s + 1);
  };
  const decrease = (e?: GestureResponderEvent) => {
    e?.stopPropagation();
    setServings((s) => Math.max(1, s - 1));
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

  return (
    <TouchableOpacity style={[styles.card, containerStyle]} onPress={toggleExpanded}>
      <View style={styles.rowBetween}>
        <Text style={[styles.title, titleStyle]}>{recipe.title}</Text>
        <TouchableOpacity onPress={handleToggleFavorite}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "red" : "black"} />
        </TouchableOpacity>
      </View>

      {recipe.description ? <Text style={[styles.description, descriptionStyle]}>{recipe.description}</Text> : null}

      {recipe.time_minutes !== null && recipe.time_minutes !== undefined ? (
        <Text style={[styles.time, timeStyle]}>⏱ {recipe.time_minutes} min</Text>
      ) : null}

      {expanded && (
        <View style={styles.expandedSection}>
          {showServingsControls && (
            <View style={styles.servingsRow}>
              <Text style={[styles.personsLabel, subheadingStyle]}>Persons:</Text>
              <TouchableOpacity onPress={decrease} style={styles.servingsButton}>
                <Text>-</Text>
              </TouchableOpacity>
              <View style={styles.servingsCount}><Text>{servings}</Text></View>
              <TouchableOpacity onPress={increase} style={[styles.servingsButton, { marginLeft: 8 }]}>
                <Text>+</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={[styles.subheading, subheadingStyle]}>Ingredients:</Text>
          {recipe.recipe_ingredients?.map((ri) => {
            const scaled = (ri.quantity * servings) / 1;
            return (
              <Text key={ri.ingredient_id} style={[styles.ingredient, ingredientStyle]}>• {formatQuantity(scaled)} {ri.unit} {ri.ingredients.name}</Text>
            );
          })}

          <Text style={[styles.subheading, subheadingStyle]}>Steps:</Text>
          {recipe.steps?.map((step, index) => (
            <Text key={index} style={[styles.step, stepStyle]}> {index + 1}. {step}</Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}
