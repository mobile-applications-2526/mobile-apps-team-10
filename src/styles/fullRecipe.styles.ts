import { Theme } from "@/src/styles/theme";
import { StyleSheet } from "react-native";

export const createFullRecipeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,

      backgroundColor: theme.colors.background,
    },

    content: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },

    header: {
      marginBottom: theme.spacing.md,
    },
    pageTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontWeights.extra,
      color: theme.colors.text,
    },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.xs,
    },

    title: {
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.extra,
      color: theme.colors.text,
      flex: 1,
      marginTop: 40,
    },

    description: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      opacity: 0.8,
      marginBottom: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    time: {
      marginTop: theme.spacing.xs,
      color: theme.colors.text,
      opacity: 0.8,
    },
    metaRow: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },

    metaText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      opacity: 0.85,
    },

    section: {
      marginTop: theme.spacing.md,
    },

    subheading: {
      fontSize: theme.fontSizes.md,
      fontWeight: theme.fontWeights.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      marginTop: theme.spacing.md,
    },

    servingsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },

    personsLabel: {
      color: theme.colors.text,
      marginRight: theme.spacing.xs,
      fontSize: theme.fontSizes.sm,
    },

    servingsButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.muted,
      borderRadius: theme.radii.md,
      marginHorizontal: 6,
    },

    servingsButtonText: {
      color: theme.colors.text,
      fontWeight: theme.fontWeights.bold,
      fontSize: theme.fontSizes.sm,
    },

    servingsCount: {
      minWidth: 32,
      alignItems: "center",
    },

    ingredientRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 6,
    },

    checkboxTouchable: {
      paddingRight: theme.spacing.sm,
      paddingVertical: 4,
    },

    ingredientText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      flex: 1,
    },

    ingredientChecked: {
      textDecorationLine: "line-through",
      color: theme.colors.placeholder,
    },

    ingredientPrice: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.placeholder,
      marginLeft: theme.spacing.sm,
    },

    step: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,

      lineHeight: 20,
      marginTop: theme.spacing.xs
    },
    stepRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 10,
    },

    stepChecked: {
      textDecorationLine: "line-through",
      opacity: 0.5,
    },
  });
