import { createHomeStyles } from "@/src/styles/home.styles";
import { useTheme } from "@/src/hooks/useTheme";
import { Image, Text, View } from "react-native";

export default function Index() {
  const theme = useTheme();
  const styles = createHomeStyles(theme as any);

  return (
    <View style={styles.container}>
      <Text testID="home-welcome" style={styles.title}>Welcome to Let 'm Cook</Text>
      <Image
        source={require("../assets/logo.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}
