import { styles } from '@/src/styles/home.styles';
import { Image, Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text testID="home-welcome" style={styles.title}>Welcome to Let 'm Cook</Text>
      <Image
        source={require('../assets/logo.png')}        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

