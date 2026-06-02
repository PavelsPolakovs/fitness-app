import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { firestore } from '@/lib/firebase';

export interface UserDoc {
  email: string | null;
  createdAt: FirebaseFirestoreTypes.FieldValue | FirebaseFirestoreTypes.Timestamp;
}

export interface WorkoutDoc {
  id: string;
  date: string;
  duration: number;
  notes: string | null;
}

export async function getUser(uid: string): Promise<UserDoc | null> {
  const doc = await firestore().collection('users').doc(uid).get();
  return doc.exists() ? (doc.data() as UserDoc) : null;
}

export async function saveWorkout(uid: string, workout: Omit<WorkoutDoc, 'id'>): Promise<string> {
  const ref = await firestore().collection('users').doc(uid).collection('workouts').add(workout);
  return ref.id;
}

export async function getWorkouts(uid: string): Promise<WorkoutDoc[]> {
  const snapshot = await firestore()
    .collection('users')
    .doc(uid)
    .collection('workouts')
    .orderBy('date', 'desc')
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<WorkoutDoc, 'id'>),
  }));
}
