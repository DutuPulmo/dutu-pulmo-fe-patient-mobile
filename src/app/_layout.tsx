import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../../global.css';

import { AppQueryProvider } from '@/providers/query-provider';
import { useAuthStore } from '@/store/auth.store';

export default function RootLayout() {
  const setHydrated = useAuthStore((state) => state.setHydrated);

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  return (
    <AppQueryProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppQueryProvider>
  );
}
