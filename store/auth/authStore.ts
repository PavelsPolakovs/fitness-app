import { Alert } from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { auth, firestore } from '@/store/firebase/firebase';
import { syncOnStart } from '@/store/sync/sync';

import { create } from 'zustand';

interface AuthState {
  userId: string | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  userId: null,
  isLoading: false,

  signInWithGoogle: async () => {
    set({ isLoading: true });
    try {
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;
      if (!idToken) throw new Error('No ID token returned from Google Sign-In');

      const credential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(credential);
      const { uid } = userCredential.user;

      const userRef = firestore().collection('users').doc(uid);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        await userRef.set({
          email: userCredential.user.email,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      }

      set({ userId: uid });
      await syncOnStart(uid);
    } catch (error) {
      console.warn('[Auth] Google sign-in failed:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  signInWithApple: () => {
    Alert.alert('Apple Sign-In', 'This sign-in method is not yet available.');
  },

  signOut: async () => {
    try {
      const { userId } = get();
      if (userId) {
        await auth().signOut();
        await GoogleSignin.signOut();
      }
      set({ userId: null });
    } catch (error) {
      console.warn('[Auth] Sign-out failed:', error);
    }
  },
}));
