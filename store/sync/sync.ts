import NetInfo from '@react-native-community/netinfo';

import { getDatabase } from '@/store/database/database';
import { firestore } from '@/lib/firebase';

export async function syncOnStart(userId: string): Promise<void> {
  const netState = await NetInfo.fetch();
  if (!netState.isConnected) {
    console.log('[Sync] Offline — skipping syncOnStart');
    return;
  }

  try {
    const db = getDatabase();
    const workoutsSnapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('workouts')
      .get();

    for (const doc of workoutsSnapshot.docs) {
      const data = doc.data();
      await db.runAsync(
        `INSERT OR REPLACE INTO workouts (id, date, duration, notes, synced)
         VALUES (?, ?, ?, ?, 1)`,
        [doc.id, data.date, data.duration, data.notes ?? null],
      );
    }

    console.log('[Sync] syncOnStart complete');
  } catch (error) {
    console.warn('[Sync] syncOnStart failed:', error);
  }
}

export async function syncOnClose(userId: string): Promise<void> {
  const netState = await NetInfo.fetch();
  if (!netState.isConnected) {
    console.log('[Sync] Offline — leaving rows unsynced');
    return;
  }

  try {
    const db = getDatabase();
    const unsyncedWorkouts = await db.getAllAsync<{
      id: string;
      date: string;
      duration: number;
      notes: string | null;
    }>('SELECT * FROM workouts WHERE synced = 0');

    for (const workout of unsyncedWorkouts) {
      await firestore().collection('users').doc(userId).collection('workouts').doc(workout.id).set({
        date: workout.date,
        duration: workout.duration,
        notes: workout.notes,
      });

      await db.runAsync('UPDATE workouts SET synced = 1 WHERE id = ?', [workout.id]);
    }

    console.log(`[Sync] syncOnClose uploaded ${unsyncedWorkouts.length} workouts`);
  } catch (error) {
    console.warn('[Sync] syncOnClose failed:', error);
  }
}
