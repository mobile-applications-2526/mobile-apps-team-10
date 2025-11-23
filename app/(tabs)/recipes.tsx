import { supabase } from '@/src/supabase/supabase';
import { useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

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
      }
      setLoading(false);
    };

    load();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (loading) return <Text style={styles.loading}>Loading recipes...</Text>;

  return (
    <View style={styles.screen}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Recipes</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.container}>
        {recipes.map((recipe) => {
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
                  {recipe.recipe_ingredients.map((ri) => (
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 35, // extra top padding
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '800',
  },
  container: {
    padding: 15,
    alignItems: 'center',
    paddingTop: 10,
  },
  loading: {
    marginTop: 50,
    fontSize: 20,
    textAlign: 'center',
  },
  recipeCard: {
    width: '90%',
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 3,
  },
  description: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
  },
  ingredient: {
    marginLeft: 12,
    fontSize: 16,
  },
  step: {
    marginLeft: 12,
    fontSize: 16,
    marginBottom: 3,
  },
});
