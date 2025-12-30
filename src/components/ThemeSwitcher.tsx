import { useThemeContext } from "@/src/context/ThemeSwitcher";
import { useTheme } from "@/src/hooks/useTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ThemeSwitcher() {
  const { themeMode, setThemeMode } = useThemeContext();
  const theme = useTheme(); // Uses your existing theme styling

  const options = [
    { id: "light", label: "Light", icon: "white-balance-sunny" },
    { id: "system", label: "Auto", icon: "brightness-auto" },
    { id: "dark", label: "Dark", icon: "moon-waning-crescent" },
  ] as const;

  return (
    <View style={[styles.container, { marginBottom: 24 }]}>
      <Text style={[styles.label, { color: theme.colors.text }]}>
        Appearance
      </Text>
      <View
        style={[
          styles.segmentContainer,
          { backgroundColor: theme.colors.muted },
        ]}
      >
        {options.map((opt) => {
          const isActive = themeMode === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => setThemeMode(opt.id)}
              style={[
                styles.segment,
                isActive && {
                  backgroundColor: theme.colors.primary,
                  borderRadius: 8,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={opt.icon}
                size={18}
                color={isActive ? "#fff" : theme.colors.placeholder}
              />
              <Text
                style={[
                  styles.segmentText,
                  { color: isActive ? "#fff" : theme.colors.text },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 8,
    opacity: 0.6,
  },
  segmentContainer: { flexDirection: "row", padding: 4, borderRadius: 12 },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 6,
  },
  segmentText: { fontSize: 14, fontWeight: "600" },
});
