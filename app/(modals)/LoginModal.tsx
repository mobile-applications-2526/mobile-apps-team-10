import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { modalStyles as styles } from "@/src/styles/modal.styles";

export default function LoginModal({
  setShowLoginModal,
}: {
  setShowLoginModal: (show: boolean) => void;
}) {
  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <Text style={styles.text}>
          You need to be logged in to favorite recipes.
        </Text>

        <TouchableOpacity
          onPress={() => {
            setShowLoginModal(false);
            // navigate to login page
            router.push("/(tabs)/account/login");
          }}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowLoginModal(false)}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
