import { StyleSheet } from 'react-native'
import theme from '@/src/styles/theme'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
    color: theme.colors.text,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: theme.radii.lg,
  },
});

export default styles;