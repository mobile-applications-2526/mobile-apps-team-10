import { Text, View, Image } from 'react-native';
import { styles } from '@/src/styles/home.styles';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Let 'm Cook</Text>
      <Image
        source={require('../assets/logo.png')}        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

