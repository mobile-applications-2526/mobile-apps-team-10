import RecipesService, { Recipe } from '@/src/services/recipes.service';
import { styles } from '@/src/styles/recipes.styles';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';


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
    const filtered = RecipesService.filterByIngredients(recipes, selectedIngredients);
    setFilteredRecipes(filtered);
  }, [selectedIngredients, recipes]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await RecipesService.fetchAll();
        if (!mounted) return;
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (err) {
        console.log('Failed to load recipes', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
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

      {/* Filter adhv ingrediënten */}
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

      {/* Toon recepten */}
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