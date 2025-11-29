import theme from "@/src/styles/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.extra,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.placeholder,
    padding: 12,
    borderRadius: theme.radii.md,
    marginBottom: 15,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
  },
  result: {
    marginTop: theme.spacing.md,
    textAlign: "center",
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
  },
});

export default styles;
