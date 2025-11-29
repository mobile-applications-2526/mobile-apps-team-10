import { supabase } from '@/src/supabase/supabase';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './recipes.styles';


type Ingredient = {
  ingredient_id: number;
  quantity: number;
  unit: string;
  ingredients: { name: string };
};

type Recipe = {
  id: number;
  title: string;
  description: string;
  steps: string[];
  recipe_ingredients: Ingredient[];
};

export default function FetchRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [filterText, setFilterText] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  const handleAddIngredient = () => {
    const ing = filterText.trim().toLowerCase();
    if (!ing || selectedIngredients.includes(ing)) return;
    setSelectedIngredients([...selectedIngredients, ing]);
    setFilterText('');
  };

  const handleRemoveIngredient = (ing: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ing));
  };

  useEffect(() => {
    if (selectedIngredients.length === 0) {
      setFilteredRecipes(recipes);
      return;
    }

    const filtered = recipes.filter(recipe =>
      selectedIngredients.every(ing =>
        recipe.recipe_ingredients.some(ri =>
          ri.ingredients.name.toLowerCase().includes(ing)
        )
      )
    );

    setFilteredRecipes(filtered);
  }, [selectedIngredients, recipes]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          id,
          title,
          description,
          steps,
          recipe_ingredients (
            quantity,
            unit,
            ingredient_id,
            ingredients (name)
          )
        `);

      if (error) {
        console.log(error);
      } else {
        setRecipes(data as Recipe[]);
        setFilteredRecipes(data as Recipe[]);
      }
      setLoading(false);
    };

    load();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (loading) return <Text style={styles.loading}>Loading recipes...</Text>;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Recipes</Text>
      </View>

      <View style={styles.filterSection}>
        <TextInput
          style={styles.input}
          placeholder="Enter ingredient..."
          value={filterText}
          onChangeText={setFilterText}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.selectedList}>
        {selectedIngredients.map(ing => (
          <View key={ing} style={styles.selectedItem}>
            <Text>{ing}</Text>
            <TouchableOpacity onPress={() => handleRemoveIngredient(ing)}>
              <Text style={styles.remove}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {filteredRecipes.map(recipe => {
          const isExpanded = expandedIds.includes(recipe.id);
          return (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => toggleExpand(recipe.id)}
            >
              <Text style={styles.title}>{recipe.title}</Text>
              <Text style={styles.description}>{recipe.description}</Text>

              {isExpanded && (
                <>
                  <Text style={styles.subheading}>Ingredients:</Text>
                  {recipe.recipe_ingredients.map(ri => (
                    <Text key={ri.ingredient_id} style={styles.ingredient}>
                      {ri.quantity} {ri.unit} {ri.ingredients.name}
                    </Text>
                  ))}

                  <Text style={styles.subheading}>Steps:</Text>
                  {recipe.steps.map((step, index) => (
                    <Text key={index} style={styles.step}>
                      {index + 1}. {step}
                    </Text>
                  ))}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}