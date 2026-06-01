import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { signInWithGoogle, signOut as firebaseSignOut } from '@/lib/auth';
import { auth, firestore } from '@/lib/firebase';
import { getUser } from '@/lib/firestore';

interface AuthContextValue {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      const uid = await signInWithGoogle();
      const existing = await getUser(uid);
      if (!existing) {
        await firestore()
          .collection('users')
          .doc(uid)
          .set({
            email: auth().currentUser?.email ?? null,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
