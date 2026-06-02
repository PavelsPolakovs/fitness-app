import 'react-native-reanimated';
import '@/constants/i18n';

import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import * as Sentry from '@sentry/react-native';

import { initDatabase } from '@/store/database/database';
import { useAppLifecycle } from '@/hooks/useAppLifecycle';

import { AuthProvider, useAuth } from '@/context/AuthContext';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const SpaceMono = require('../assets/fonts/SpaceMono-Regular.ttf');

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
});

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({ SpaceMono });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn('[Layout] DB init failed:', err);
        setDbReady(true);
      });
  }, []);

  useEffect(() => {
    if (fontsLoaded && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, dbReady]);

  if (!fontsLoaded || !dbReady) {
    return null;
  }

  return (
    <AuthProvider>
      <RootNav />
    </AuthProvider>
  );
});

function RootNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useAppLifecycle();

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) {
      router.replace('/(auth)/login');
    } else if (user && inAuth) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
