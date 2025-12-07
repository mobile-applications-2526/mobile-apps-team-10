import { Stack } from "expo-router";

export default function RecipesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]"
        options={{
          // this allows to swipe from left to right to return
          gestureEnabled: true,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
