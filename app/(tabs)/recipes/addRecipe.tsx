import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/hooks/useTheme";
import { saveGeneratedRecipe } from "@/src/services/recipeGeneration.service";
import { router } from "expo-router";

export default function AddRecipeScreen() {
  const theme = useTheme();

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [steps, setSteps] = useState<string[]>([""]);
  const [ingredients, setIngredients] = useState<
    { name: string; quantity: string; unit: string; price: string }[]
  >([{ name: "", quantity: "", unit: "", price: "" }]);


  const addStep = () => setSteps([...steps, ""]);
  const addIngredient = () =>
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);

  const saveRecipe = async () => {
    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter a recipe title.");
      return;
    }

    const recipe = {
      title,
      cookingTimeMinutes: Number(time) || 30,
      steps: steps.filter((s) => s.trim().length > 0),
      ingredients: ingredients
        .filter((i) => i.name.trim().length > 0)
        .map((i) => ({
          name: i.name,
          quantity: i.quantity || 1,
          unit: i.unit || "unit",
        })),
    };

    try {
      await saveGeneratedRecipe(recipe);
      Alert.alert("Success", "Recipe saved!");
      router.replace("/recipes");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to save recipe");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: theme.colors.text,
            marginBottom: 16,
          }}
        >
          Add a recipe
        </Text>

        {/* TITLE */}
        <TextInput
          placeholder="Recipe title"
          placeholderTextColor={theme.colors.placeholder}
          value={title}
          onChangeText={setTitle}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: 12,
            borderRadius: 8,
            color: theme.colors.text,
            marginBottom: 12,
          }}
        />

        {/* TIME */}
        <TextInput
          placeholder="Cooking time (minutes)"
          placeholderTextColor={theme.colors.placeholder}
          keyboardType="numeric"
          value={time}
          onChangeText={setTime}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: 12,
            borderRadius: 8,
            color: theme.colors.text,
            marginBottom: 20,
          }}
        />

        {/* INGREDIENTS */}
        <Text style={{ color: theme.colors.text, fontWeight: "600" }}>
          Ingredients
        </Text>

        {ingredients.map((ing, idx) => (
          <View key={idx} style={{ marginBottom: 12 }}>
            <TextInput
              placeholder="Ingredient name"
              placeholderTextColor={theme.colors.placeholder}
              value={ing.name}
              onChangeText={(v) => {
                const copy = [...ingredients];
                copy[idx].name = v;
                setIngredients(copy);
              }}
              style={inputStyle(theme)}
            />

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TextInput
                placeholder="Qty"
                placeholderTextColor={theme.colors.placeholder}
                keyboardType="numeric"
                value={ing.quantity}
                onChangeText={(v) => {
                  const copy = [...ingredients];
                  copy[idx].quantity = v;
                  setIngredients(copy);
                }}
                style={[inputStyle(theme), { flex: 1 }]}
              />

              <TextInput
                placeholder="Unit"
                placeholderTextColor={theme.colors.placeholder}
                value={ing.unit}
                onChangeText={(v) => {
                  const copy = [...ingredients];
                  copy[idx].unit = v;
                  setIngredients(copy);
                }}
                style={[inputStyle(theme), { flex: 1 }]}
              />

              <TextInput
                placeholder="€/unit"
                placeholderTextColor={theme.colors.placeholder}
                keyboardType="numeric"
                value={ing.price}
                onChangeText={(v) => {
                  const copy = [...ingredients];
                  copy[idx].price = v;
                  setIngredients(copy);
                }}
                style={[inputStyle(theme), { flex: 1 }]}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity onPress={addIngredient}>
          <Text style={{ color: theme.colors.primary, marginBottom: 20 }}>
            + Add ingredient
          </Text>
        </TouchableOpacity>

        {/* STEPS */}
        <Text style={{ color: theme.colors.text, fontWeight: "600" }}>
          Steps
        </Text>

        {steps.map((step, idx) => (
          <TextInput
            key={idx}
            placeholder={`Step ${idx + 1}`}
            placeholderTextColor={theme.colors.placeholder}
            value={step}
            onChangeText={(v) => {
              const copy = [...steps];
              copy[idx] = v;
              setSteps(copy);
            }}
            style={inputStyle(theme)}
          />
        ))}

        <TouchableOpacity onPress={addStep}>
          <Text style={{ color: theme.colors.primary, marginBottom: 30 }}>
            + Add step
          </Text>
        </TouchableOpacity>

        {/* SAVE */}
        <TouchableOpacity
          onPress={saveRecipe}
          style={{
            backgroundColor: theme.colors.accent,
            padding: 14,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: theme.colors.white,
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            Save recipe
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const inputStyle = (theme: any) => ({
  borderWidth: 1,
  borderColor: theme.colors.border,
  padding: 12,
  borderRadius: 8,
  color: theme.colors.text,
  marginTop: 8,
});
