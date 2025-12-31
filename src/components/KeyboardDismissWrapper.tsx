import { Platform, Keyboard, TouchableWithoutFeedback } from "react-native";

const KeyboardDismissWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (Platform.OS === "web") {
    return <>{children}</>;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default KeyboardDismissWrapper;
