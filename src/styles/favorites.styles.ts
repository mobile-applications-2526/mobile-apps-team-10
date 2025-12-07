import { StyleSheet } from "react-native";
import theme from "@/src/styles/theme";

export const favoritesStyles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: theme.spacing.md,
    paddingTop: 35,
    backgroundColor: theme.colors.background,
  },

  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.extra,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },

  loadingContainer: {
    marginTop: theme.spacing.xl,
    alignItems: "center",
  },

  emptyText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.placeholder,
    textAlign: "center",
  },

  listWrapper: {
    marginTop: theme.spacing.sm,
  },

  card: {
    width: "100%",
    backgroundColor: theme.colors.muted,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  cardTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: 3,
  },

  cardDescription: {
    fontSize: theme.fontSizes.sm,
    fontStyle: "italic",
    color: theme.colors.text,
    opacity: 0.7,
  },
});
