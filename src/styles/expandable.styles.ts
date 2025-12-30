import { Theme } from "@/src/styles/theme";
import { StyleSheet } from "react-native";

export const createExpandableStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.white || "#fff",
      borderRadius: theme.radii.lg,
      marginBottom: theme.spacing.md,
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 1,
    },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.bold,
      flex: 1,
      color: theme.colors.text,
    },
    description: {
      color: theme.colors.text,
      opacity: 0.8,
      marginTop: theme.spacing.sm,
    },
    time: {
      marginTop: theme.spacing.sm,
      color: theme.colors.text,
      opacity: 0.8,
    },
    expandedSection: { marginTop: theme.spacing.sm },
    servingsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    personsLabel: { marginRight: theme.spacing.sm, color: theme.colors.text },
    servingsButton: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: theme.colors.muted,
      borderRadius: theme.radii.md,
      marginRight: 8,
    },
    servingsButtonText: {
      color: theme.colors.text,
      fontWeight: theme.fontWeights.bold,
    },
    servingsCount: {
      minWidth: 32,
      alignItems: "center",
    },
    subheading: {
      fontWeight: theme.fontWeights.semibold,
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
      color: theme.colors.text,
    },
    ingredient: { marginBottom: 4, color: theme.colors.text },
    step: { marginVertical: 4, color: theme.colors.text },
    ingredientRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    checkboxTouchable: {
      padding: 6,
      marginRight: 8,
    },
    ingredientText: {
      flex: 1,
      color: theme.colors.text,
      paddingTop: 6,
    },
    ingredientChecked: {
      textDecorationLine: "line-through",
      color: theme.colors.placeholder,
    },
    goToRecipeButton: {
      backgroundColor: theme.colors.accent,
      marginTop: theme.spacing.md,
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: theme.radii.md,
      justifyContent: "center",
      alignItems: "center",
    },
  });
