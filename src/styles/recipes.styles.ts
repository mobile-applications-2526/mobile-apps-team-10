import theme from "@/src/styles/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
    backgroundColor: theme.colors.background,
    zIndex: 10,
  },
  pageTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.extra,
    color: theme.colors.text,
  },
  container: {
    padding: theme.spacing.md,
    alignItems: "center",
    paddingTop: theme.spacing.sm,
  },
  loading: {
    marginTop: 50,
    fontSize: theme.fontSizes.md,
    textAlign: "center",
    color: theme.colors.text,
  },
  recipeCard: {
    width: "90%",
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.muted,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
    marginBottom: 3,
    color: theme.colors.text,
  },
  description: {
    fontSize: theme.fontSizes.sm,
    fontStyle: "italic",
    marginBottom: 8,
    color: theme.colors.text,
  },
  subheading: {
    fontSize: theme.fontSizes.sm + 2,
    fontWeight: theme.fontWeights.semibold,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  ingredient: {
    marginLeft: 12,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
  },
  step: {
    marginLeft: 12,
    fontSize: theme.fontSizes.sm,
    marginBottom: 3,
    color: theme.colors.text,
  },
  filterSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: theme.radii.md,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
  },
  selectedList: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.muted,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radii.round,
    marginRight: 8,
    marginBottom: 8,
  },
  remove: {
    marginLeft: 6,
    color: theme.colors.danger,
    fontWeight: theme.fontWeights.bold,
  },
  filterButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radii.md,
    marginLeft: 5,
  },
  filterButtonText: {
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
  },
  loadingContainer: {
    marginTop: theme.spacing.xl,
    alignItems: "center",
  },
});

export default styles;
