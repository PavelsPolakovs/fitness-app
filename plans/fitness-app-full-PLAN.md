# Plan: Fitness App — Full Project Scaffold

> Generated for Claude Code. Review Open Questions before running.

## Goal

Bootstrap a React Native (Expo) fitness app with bottom tab navigation, SQLite offline-first storage, Firebase Authentication (Google + Apple), Firestore cloud sync, strict TypeScript, ESLint (flat config), Prettier, Jest testing, Sentry error monitoring, Unistyles theming (light + Nord), i18next localization (RU + EN), sorted imports with aliases, a Makefile for all developer workflows, GitHub Actions CI pipeline, and local CI testing via act.

## Steps

1. **Scaffold project** — run `npx create-expo-app fitness-app --template tabs`; install runtime deps: `expo-sqlite`, `@react-native-async-storage/async-storage`, `@react-native-firebase/app`, `@react-native-firebase/auth`, `@react-native-firebase/firestore`, `@react-native-google-signin/google-signin`, `zustand`, `@sentry/react-native`, `react-native-unistyles`, `i18next`, `react-i18next`; install dev deps: `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-native`, `eslint-plugin-import`, `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier`, `jest`, `jest-expo`, `@testing-library/react-native`, `@testing-library/jest-native`

2. **Create folder structure** — add directories: `app/(auth)/`, `app/(tabs)/`, `components/ui/`, `components/workout/`, `store/database/`, `store/sync/`, `store/auth/`, `store/firebase/`, `hooks/`, `constants/locales/`; tests live next to the files they test inside each module folder

3. **Configure TypeScript** — update `tsconfig.json`: set `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`, `noUnusedLocals: true`, `noUnusedParameters: true`; add path aliases `@/app`, `@/components`, `@/store`, `@/hooks`, `@/constants` in both `tsconfig.json` and `babel.config.js`

4. **Configure ESLint** — create `eslint.config.js` (flat config format) extending `@typescript-eslint/recommended`, `plugin:react/recommended`, `plugin:react-hooks/recommended`, `plugin:react-native/all`, `prettier`; add rules: `no-console: warn`, `import/order` to enforce sorted imports (builtin → external → internal aliases → relative), `import/no-unresolved` to validate aliases; linter fails on unsorted imports or relative paths where an alias exists; create `.eslintignore` excluding `node_modules/`, `android/`, `ios/`, `.expo/`, `dist/`

5. **Configure Prettier** — create `.prettierrc` with `printWidth: 100`, `tabWidth: 2`, `singleQuote: true`, `trailingComma: 'all'`, `semi: true`; create `.prettierignore` excluding same dirs as `.eslintignore`

6. **Configure Jest** — update `package.json` with jest config: `preset: 'jest-expo'`, `setupFilesAfterFramework: ['@testing-library/jest-native/extend-expect']`; create placeholder test files next to each module: `store/database/database.test.ts`, `store/sync/sync.test.ts`, `store/auth/authStore.test.ts` — each with one `it('should be implemented', () => expect(true).toBe(true))` stub

7. **Add scripts to package.json** — add: `lint`, `lint:fix`, `format`, `format:check`, `typecheck`, `test`, `test:watch`

8. **Create Makefile** — create `Makefile` at project root with targets: `help`, `install`, `start`, `start-android`, `start-ios`, `lint`, `lint-fix`, `format`, `format-check`, `typecheck`, `test`, `test-watch`, `check-all`, `ci`, `clean`; every target calls the corresponding `npm run` script; `check-all` runs lint + format-check + typecheck + test; `ci` runs `act push`; `help` prints all available targets with descriptions

9. **Create GitHub Actions CI workflow** — create `.github/workflows/ci.yml` triggered on `push` and `pull_request` to `main`; job steps: checkout, setup Node LTS, cache `node_modules`, `npm install`, lint, format-check, typecheck, test; configure branch protection on `main`: block direct push, require CI to pass before merge; add `SENTRY_DSN` as GitHub Secret

10. **Configure act for local CI** — create `.actrc` at project root with `--platform ubuntu-latest=catthehacker/ubuntu:act-latest`; add act install instructions (requires Docker) to `README.md`

11. **Configure Sentry** — run `npx @sentry/wizard@latest -i reactNative`; initialise Sentry in `app/_layout.tsx` with `Sentry.init()` reading DSN from `SENTRY_DSN` environment variable; create `.env.local` and `.env.production` (excluded from git) with real DSN value from project instructions; create `.env.example` (committed) with `SENTRY_DSN=` placeholder; add `SENTRY_DSN` as GitHub Secret in repository settings

12. **Initialize SQLite** — create `store/database/database.ts` with `initDatabase()` using `CREATE TABLE IF NOT EXISTS` for tables: `workouts` (id, date, duration, notes, synced), `exercises` (id, workout_id, type [strength/cardio/cooldown], name, muscle_group, equipment, synced), `sets` (id, exercise_id, weight_kg_each, weight_kg_total, reps, speed_kmh, duration_min, note, synced), `exercise_notes` (id, exercise_id, type [technique/pain/sensation], priority [high/medium], text)

13. **Configure Firebase** — create `store/firebase/firebase.ts` exporting `auth` and `firestore`; add `google-services.json` to `/android` and `GoogleService-Info.plist` to `/ios` (both excluded from git); set Firestore security rules so each user can only read/write their own data under `users/{userId}/`

14. **Implement authentication** — create `store/auth/authStore.ts` with Zustand; add `signInWithGoogle()`, `signInWithApple()`, `signOut()`; on first sign-in automatically create user profile document in Firestore then immediately run `syncOnStart()`; Apple Sign-In is a stub that shows "This sign-in method is not yet available"

15. **Implement sync logic** — create `store/sync/sync.ts` with `syncOnStart()` (download from Firestore → write to SQLite) and `syncOnClose()` (read rows where `synced = 0` from SQLite → upload to Firestore, mark as `synced = 1`); on no-internet leave `synced = 0` for retry on next start

16. **Create lifecycle hook** — create `hooks/useAppLifecycle.ts` listening to `AppState`: call `syncOnStart` on foreground, `syncOnClose` on background/inactive

17. **Configure root layout** — update `app/_layout.tsx` to: call `initDatabase()` on mount, attach `useAppLifecycle()`, initialise Sentry, show loading screen while initialising (placeholder, animation to be added later), redirect unauthenticated users to `/(auth)/login`

18. **Build login screen** — create `app/(auth)/login.tsx` with "Sign in with Google" button (full flow) and "Sign in with Apple" button (shows "not yet available" message); on successful Google sign-in redirect to `/(tabs)/`

19. **Configure Unistyles and bottom tab bar** — configure `react-native-unistyles`; create `constants/themes.ts` with `lightTheme` and `nordTheme` (colors, spacing, typography); update `app/(tabs)/_layout.tsx` with 4 tabs: Home, Workout, Progress, Profile using Unistyles tokens for colors and dark orange accent

20. **Configure i18next localization** — create `constants/locales/en.json` and `constants/locales/ru.json` with placeholder keys; configure i18next to auto-detect language from device settings; expose manual language switcher for Profile screen

21. **Create screen stubs** — create `app/(tabs)/index.tsx`, `workout.tsx`, `progress.tsx`, `profile.tsx` each with a heading placeholder; all screens use Unistyles theme tokens for colors and i18next for text

22. **Set up GitHub repository** — run `git init`; create `.gitignore` excluding `google-services.json`, `GoogleService-Info.plist`, `.env.local`, `.env.production`, `node_modules/`, `.expo/`; commit `.env.example` with placeholder values; push to remote

## Definition of Done

- [ ] `make install` completes without errors
- [ ] `make start` launches Expo and shows QR code
- [ ] `make lint` passes with no errors
- [ ] `make format` reformats files without errors
- [ ] `make typecheck` exits 0 on clean code
- [ ] `make test` runs all placeholder tests and passes
- [ ] `make check-all` runs lint + format-check + typecheck + test and passes
- [ ] `make ci` runs GitHub Actions workflow locally via act and passes
- [ ] `.github/workflows/ci.yml` triggers on push and pull_request to main
- [ ] CI passes on GitHub after first push
- [ ] Branch protection on main is active — direct push blocked, CI required for merge
- [ ] Sentry initialises without errors on app launch (verified via logs)
- [ ] `SENTRY_DSN` is read from environment variable, not hardcoded
- [ ] SQLite tables are created on first launch (verified via logs)
- [ ] `syncOnStart` and `syncOnClose` fire at correct AppState transitions (verified via logs)
- [ ] Google Sign-In flow completes and redirects to main tabs
- [ ] Apple Sign-In button shows "not yet available" message
- [ ] First sign-in creates user profile in Firestore and triggers sync
- [ ] Expo Go on a physical device shows bottom tab bar with 4 tabs
- [ ] Unistyles light and Nord themes are defined and applied
- [ ] i18next initialises and loads EN and RU locale files
- [ ] ESLint fails on unsorted imports and relative paths where alias exists
- [ ] `.gitignore` excludes all secret config files
- [ ] `.env.example` is committed with placeholder values
- [ ] Repository pushed to GitHub

## Conventions to Follow

- All data and text content must be mock/fake — no real user data
- No detailed implementation inside screens — stubs only at this stage
- Use `@/` aliases everywhere — relative paths are not allowed and will fail lint
- Imports must be sorted: builtin → external → internal aliases → relative
- Single quotes everywhere (enforced by Prettier)
- Claude Code receives top-level instructions only — it decides implementation details
- Do not create files not explicitly listed in the plan
- Move step by step — do not skip ahead

## ⚠️ Open Questions

- Expo ships with its own `tsconfig.json` extending `expo/tsconfig.base` — confirm strict flags and path aliases do not conflict before running step 3
- `act` requires Docker to be installed locally — confirm Docker is available before step 10
- Apple Sign-In requires an Apple Developer account — confirm availability before step 14
- Firebase project must be created manually at firebase.google.com — Claude Code cannot create it
- Task is large — consider splitting: Phase 1 (steps 1–11): scaffold + tooling + CI + Sentry, Phase 2 (steps 12–22): DB + auth + sync + screens + GitHub
