import 'react-native-reanimated';

import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import * as Sentry from '@sentry/react-native';

import { useAuthStore } from '@/store/auth/authStore';
import { initDatabase } from '@/store/database/database';
import { useAppLifecycle } from '@/hooks/useAppLifecycle';

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
  const userId = useAuthStore((state) => state.userId);

  const [fontsLoaded, fontError] = useFonts({
    SpaceMono,
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      // eslint-disable-next-line no-console
      .catch((err) => console.warn('[Layout] DB init failed:', err));
  }, []);

  useEffect(() => {
    if (fontsLoaded && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, dbReady]);

  useAppLifecycle();

  if (!fontsLoaded || !dbReady) {
    return null;
  }

  if (!userId) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
});
