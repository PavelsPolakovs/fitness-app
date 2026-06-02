import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { auth } from '@/lib/firebase';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export async function signInWithGoogle(): Promise<string> {
  await GoogleSignin.hasPlayServices();
  const result = await GoogleSignin.signIn();
  const idToken = result.data?.idToken;
  if (!idToken) throw new Error('No ID token from Google Sign-In');

  const credential = auth.GoogleAuthProvider.credential(idToken);
  const userCredential = await auth().signInWithCredential(credential);
  return userCredential.user.uid;
}

export async function signOut(): Promise<void> {
  await auth().signOut();
  await GoogleSignin.signOut();
}
