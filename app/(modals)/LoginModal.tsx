import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function LoginModal({
  setShowLoginModal,
}: {
  setShowLoginModal: (show: boolean) => void;
}) {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 10,
          width: "80%",
        }}
      >
        <Text testID="login-modal" style={{ fontSize: 18, marginBottom: 10 }}>
          You need to be logged in to favorite recipes.
        </Text>

        <TouchableOpacity
          onPress={() => {
            setShowLoginModal(false);
            // navigate to login page
            router.push("/(tabs)/account/login");
          }}
          style={{
            padding: 10,
            backgroundColor: "tomato",
            borderRadius: 8,
            marginBottom: 10,
          }}
          testID="login-modal-login"
        >
          <Text style={{ color: "white", textAlign: "center" }}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowLoginModal(false)} testID="login-modal-close">
          <Text style={{ textAlign: "center" }}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
