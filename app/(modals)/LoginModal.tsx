import { useTheme } from "@/src/hooks/useTheme";
import { createModalStyles } from "@/src/styles/modal.styles";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function LoginModal({
  setShowLoginModal,
}: {
  setShowLoginModal: (show: boolean) => void;
}) {
  const theme = useTheme();
  const styles = createModalStyles(theme as any);
  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <Text testID="login-modal" style={styles.text}>
          You need to be logged in to favorite recipes.
        </Text>

        <TouchableOpacity
          onPress={() => {
            setShowLoginModal(false);
            // navigate to login page
            router.push("/(tabs)/account/login");
          }}
          style={styles.loginButton}
          testID="login-modal-login"
        >
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowLoginModal(false)} testID="login-modal-close">
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
