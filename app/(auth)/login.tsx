import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();

  if (user) {
    router.replace('/(tabs)/');
    return null;
  }

  const handleApple = () => {
    alert('This sign-in method is not yet available.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness App</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TouchableOpacity style={styles.button} onPress={signIn} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign in with Google</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.appleButton]} onPress={handleApple}>
        <Text style={styles.buttonText}>Sign in with Apple</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#E25822',
    alignItems: 'center',
    marginBottom: 12,
  },
  appleButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
