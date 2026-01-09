import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

export const getAuthRedirectUrl = () => {
  if (Platform.OS === 'web') return 'http://localhost:8081/auth/callback';

  // FORCE the scheme to ensure it doesn't default to http://localhost
  return Linking.createURL('auth/callback', { 
    scheme: 'let-m-cook' 
  });
};