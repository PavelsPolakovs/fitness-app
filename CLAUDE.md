# CLAUDE.md

Инструкции для Claude при работе в этом репозитории.

## Stack

React Native · Expo 56 · expo-router · TypeScript strict · SQLite (expo-sqlite) · Firebase Auth + Firestore · Zustand · Sentry · i18next · ESLint flat config · Prettier · Jest

## Workflow

1. **Прочитать конфигурацию проекта перед написанием любого кода** — параллельно:
   - `tsconfig.json` — флаги компилятора (`strict`, `noUnusedLocals`, `noUnusedParameters`)
   - `.prettierrc` — правила форматирования
   - `eslint.config.js` — правила линтера
   - Один существующий файл того же типа (screen/store/hook/component) — для понимания паттернов
2. При неясностях — задать вопросы через `AskUserQuestion` (label + 1 строка описания, 2–4 варианта).
3. Создать ветку `feat/<slug>` или `fix/<slug>` и переключиться на неё (`git checkout -b`). **Только после этого приступать к выполнению.**
4. Создать `TaskCreate` по шагам задачи, выполнять последовательно, обновлять статус (`in_progress` → `completed`).
5. После каждого значимого изменения — быстрые проверки: `make lint`, `make format-check`, `make typecheck`.
6. По завершении всех шагов — `make check-all` (lint + format-check + typecheck + test).
7. Показать `git status` + `git diff --stat`. **Не коммитить и не пушить.**
8. По команде пользователя (`завершить` / `finish`) — выполнить полный финальный цикл (см. секцию **Завершение задачи**).

## Команды

- `make start` — Expo dev server (показывает QR)
- `make start-android` — запуск на Android
- `make lint` — ESLint
- `make lint-fix` — ESLint с автофиксом
- `make format` — Prettier write
- `make format-check` — Prettier check
- `make typecheck` — TypeScript без сборки
- `make test` — Jest
- `make test-watch` — Jest в watch-режиме
- `make check-all` — lint + format-check + typecheck + test
- `make ci` — локальный прогон CI через `act` (требует Docker)
- `make clean` — удалить `node_modules`, `.expo`, `dist`

## Правила

- **Никогда не вносить изменения в код на `main`** — создать ветку первым действием до любых правок (шаг 3).
- **Никогда не коммитить и не пушить без явной команды** пользователя.
- **Никогда не пушить в `main` напрямую** — только через PR из ветки.
- **Импорты всегда через алиасы** (`@/components/...`, `@/store/...` и т.д.) — относительные пути (`../`) недопустимы и упадут на lint.
- **Порядок импортов**: builtin → external (react, expo) → external (остальные) → internal (`@/`) → relative. Автофикс: `make lint-fix`.
- **Падающие локальные проверки чинить самостоятельно**, спрашивать только если нужна смена подхода.
- **Никогда не коммитить секреты**: `.env.local`, `.env.production`, `google-services.json`, `GoogleService-Info.plist`, `.claude/credentials.json` — все в `.gitignore`.
- **Не пропускать git hooks** (`--no-verify` и т.п.) без явной просьбы пользователя.
- **Читать актуальную документацию Expo** перед использованием API: https://docs.expo.dev/versions/v56.0.0/

## Завершение задачи

По команде пользователя (`завершить` / `finish`) выполнить последовательно:

1. Если есть незакоммиченные изменения — закоммитить их.
2. Запушить ветку и открыть PR.
3. Дождаться, пока все CI-проверки перейдут в `pass` — опрашивать `gh pr checks <n>` до полного исчезновения строк `pending`. **Никогда не использовать auto-merge** (`--auto`): всегда ждать завершения CI и мерджить вручную командой `gh pr merge <n> --squash --delete-branch`.
4. Вернуться на `main` и стянуть изменения.
