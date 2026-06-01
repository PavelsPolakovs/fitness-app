import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useAuthStore } from '@/store/auth/authStore';
import { syncOnClose, syncOnStart } from '@/store/sync/sync';

export function useAppLifecycle(): void {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState) => {
      if (!userId) return;

      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        console.log('[Lifecycle] Foreground — running syncOnStart');
        await syncOnStart(userId);
      }

      if (appState.current === 'active' && nextState.match(/inactive|background/)) {
        console.log('[Lifecycle] Background — running syncOnClose');
        await syncOnClose(userId);
      }

      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [userId]);
}
