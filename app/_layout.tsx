    // app/_layout.tsx
    import { Tabs } from 'expo-router';
    import { Ionicons } from '@expo/vector-icons';

    export default function RootLayout() {
      return (
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          }}
        >
          <Tabs.Screen
            name="(tabs)/index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(tabs)/recipes"
            options={{
              title: 'Recipes',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="restaurant" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
                  name="(tabs)/signup"
                  options={{
                    title: 'Account',
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="person" size={size} color={color} />
                    ),
                  }}
                />
        </Tabs>
      );
    }
