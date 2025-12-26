import { Theme } from "@/src/styles/theme";
import { StyleSheet } from "react-native";

export const createModalStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.modalBackground,
      justifyContent: "center",
      alignItems: "center",
    },
    box: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      borderRadius: theme.radii.md,
      width: "80%",
    },
    text: {
      fontSize: theme.fontSizes.md,
      marginBottom: theme.spacing.sm,
      color: theme.colors.text,
    },
    loginButton: {
      padding: 10,
      backgroundColor: theme.colors.accent,
      borderRadius: theme.radii.sm,
      marginBottom: theme.spacing.sm,
      alignItems: "center",
    },
    loginButtonText: {
      color: theme.colors.white,
    },
    closeText: {
      textAlign: "center",
      color: theme.colors.text,
    },
  });
