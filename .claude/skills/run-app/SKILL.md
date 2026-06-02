---
name: run-app
description: Run the fitness-app on a physical Android device via USB. Use this skill when asked to launch, run, or preview the app.
allowed-tools:
  - Bash
  - Read
---

# Run fitness-app on Android (USB)

## Requirements

- Sony Xperia XQ-CT54 (или другой Android телефон) подключён USB-кабелем
- USB debugging включён на телефоне (Настройки → Для разработчиков → Отладка по USB)
- На телефоне установлен APK (dev build): `com.palevich.fitnessapp`

## Step 1 — Check ADB

```bash
export PATH="$HOME/Android/Sdk/platform-tools:$PATH"
adb devices
```

Ожидаемый результат: `QV7706ULCQ   device` (или другой серийный номер со статусом `device`).

Если статус `no permissions`:
```bash
# Запустить в обычном терминале с sudo:
echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="0fce", MODE="0666", GROUP="plugdev"' | sudo tee /etc/udev/rules.d/51-android.rules
sudo udevadm control --reload-rules && sudo udevadm trigger
# Переподключить USB-кабель
```

Если устройство не видно — проверить кабель и разрешение на телефоне (всплывёт диалог "Разрешить отладку?").

## Step 2 — Start Metro

```bash
# Остановить старые tmux-сессии если есть
tmux kill-session -t expo-run 2>/dev/null; true

# Запустить Metro в фоне
tmux new-session -d -s expo-run -x 220 -y 50
tmux send-keys -t expo-run "npx expo start --scheme fitnessapp --clear 2>&1" Enter

# Дождаться готовности (ищем QR-код или "Waiting on")
sleep 15
tmux capture-pane -t expo-run -p | grep -E "Metro:|Waiting|8081|8082"
```

Если порт занят — Metro спросит использовать следующий, ответить `Y`.

## Step 3 — Set ADB reverse (порт через USB)

```bash
export PATH="$HOME/Android/Sdk/platform-tools:$PATH"

# Определить порт Metro (обычно 8081 или 8082)
METRO_PORT=$(tmux capture-pane -t expo-run -p | grep -oP 'localhost:\K\d+' | head -1)
METRO_PORT=${METRO_PORT:-8081}

adb reverse tcp:${METRO_PORT} tcp:${METRO_PORT}
echo "ADB reverse set for port $METRO_PORT"
```

## Step 4 — Open app on device

```bash
export PATH="$HOME/Android/Sdk/platform-tools:$PATH"
METRO_PORT=$(tmux capture-pane -t expo-run -p | grep -oP 'localhost:\K\d+' | head -1)
METRO_PORT=${METRO_PORT:-8081}

adb shell am start -a android.intent.action.VIEW \
  -d "fitnessapp://expo-development-client/?url=http%3A%2F%2Flocalhost%3A${METRO_PORT}"
```

Телефон откроет dev client и начнёт загружать бандл (~30 сек первый раз).

## Step 5 — Verify

```bash
# Сделать скриншот через 20 сек
sleep 20
export PATH="$HOME/Android/Sdk/platform-tools:$PATH"
adb exec-out screencap -p > /tmp/app-screen.png
```

Открыть `/tmp/app-screen.png` — должен быть виден экран входа или главный экран (если уже залогинен).

## Logs

```bash
# JS логи в реальном времени
export PATH="$HOME/Android/Sdk/platform-tools:$PATH"
adb logcat -s ReactNativeJS | grep -v "deprecated\|migration\|rnfirebase"

# Metro логи
tmux attach -t expo-run
# Выйти из tmux: Ctrl+B, затем D
```

## Если APK не установлен

Собрать новый dev build через EAS:

```bash
# Требует подключения к интернету и логина в EAS
eas build --platform android --profile development --no-wait
# Ссылка на APK появится на expo.dev после сборки (~15 мин)
# Открыть ссылку на телефоне → скачать → установить
```

После установки нового APK повторить Step 3–5.

## Known issues

- **Бесконечный чёрный экран**: ADB reverse не настроен или Metro не запущен. Повторить Step 2–4.
- **"Failed to connect"**: Metro недоступен. Проверить `tmux attach -t expo-run` и повторить Step 3.
- **Google Sign-In не работает**: SHA-1 fingerprint APK не зарегистрирован в Firebase Console → Project Settings → Android app → SHA certificate fingerprints.
