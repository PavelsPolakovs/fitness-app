# Plan: Firebase Auth and Firestore Integration

> Generated for Claude Code. Review Open Questions before running.

## Goal

Connect Firebase Authentication (Google Sign-In) and Firestore to the React Native fitness app using `@react-native-firebase`.

## Steps

1. **Install dependencies** — add `@react-native-firebase/auth` and `@react-native-firebase/firestore` packages via `npx expo install`

2. **Create Firebase config module** — create `lib/firebase.ts` that initializes and exports `auth` and `firestore` instances from `@react-native-firebase`

3. **Create auth service** — create `lib/auth.ts` with `signInWithGoogle()` and `signOut()` functions using `@react-native-firebase/auth` and `@react-native-google-signin/google-signin`

4. **Install Google Sign-In package** — add `@react-native-google-signin/google-signin` and configure it with `webClientId` from `google-services.json`

5. **Create Firestore service** — create `lib/firestore.ts` with typed helper functions: `getUser()`, `saveWorkout()`, `getWorkouts()` scoped to `users/{uid}/workouts`

6. **Create auth context** — create `context/AuthContext.tsx` with `AuthProvider` and `useAuth` hook that exposes `user`, `signIn`, `signOut`, `loading`

7. **Wrap app with AuthProvider** — update `app/_layout.tsx` to wrap the root with `AuthProvider`

8. **Guard routes** — in `app/_layout.tsx` redirect unauthenticated users to the login screen using `useAuth`

9. **Run prebuild** — run `npx expo prebuild --clean` to apply native Firebase plugin changes

## Definition of Done

- [ ] `npx expo prebuild` completes without errors
- [ ] `make typecheck` passes with no TypeScript errors
- [ ] `useAuth()` returns a valid user object after Google Sign-In
- [ ] Unauthenticated users are redirected to login screen
- [ ] Authenticated user's document is readable/writable in Firestore under `users/{uid}`
- [ ] `signOut()` clears the user and redirects to login

## Conventions to Follow

- All data and text content must be mock/fake — no real user data at this stage
- No detailed UI implementation inside screens — stubs only
- Claude Code receives top-level instructions only — it decides implementation details
- Do not create files not explicitly listed in the plan
- Move step by step — do not skip ahead

## ⚠️ Open Questions

- `webClientId` for Google Sign-In must be taken from `google-services.json` → `client[0].oauth_client` where `client_type == 3` — confirm this value is present before step 4
- `google-services.json` must be in the project root — confirm location before running prebuild
