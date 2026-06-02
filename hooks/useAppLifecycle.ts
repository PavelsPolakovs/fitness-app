import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { syncOnClose, syncOnStart } from '@/store/sync/sync';

import { useAuth } from '@/context/AuthContext';

export function useAppLifecycle(): void {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const { user } = useAuth();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState) => {
      if (!user) return;

      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        // eslint-disable-next-line no-console
        console.log('[Lifecycle] Foreground — running syncOnStart');
        await syncOnStart(user.uid);
      }

      if (appState.current === 'active' && nextState.match(/inactive|background/)) {
        // eslint-disable-next-line no-console
        console.log('[Lifecycle] Background — running syncOnClose');
        await syncOnClose(user.uid);
      }

      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [user]);
}
