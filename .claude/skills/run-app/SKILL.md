---
name: run-app
description: Run the fitness-app on a physical Android device via USB. Use this skill when asked to launch, run, or preview the app.
allowed-tools:
  - Bash
  - Read
---

# Run fitness-app on Android (USB)

## Requirements

- Android phone connected via USB cable
- USB debugging enabled (Settings → Developer options → USB debugging)
- Dev build APK installed: `com.palevich.fitnessapp`

## Step 1 — Check ADB

```bash
export PATH="$HOME/Android/Sdk/platform-tools:$PATH"
adb devices
```

Expected: a device serial with status `device`.

If status is `no permissions`, run in a regular terminal with sudo:
```bash
echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="0fce", MODE="0666", GROUP="plugdev"' | sudo tee /etc/udev/rules.d/51-android.rules
sudo udevadm control --reload-rules && sudo udevadm trigger
# Reconnect the USB cable
```

## Step 2 — Start Metro

```bash
tmux kill-session -t expo-run 2>/dev/null; true
tmux new-session -d -s expo-run -x 220 -y 50
tmux send-keys -t expo-run "npx expo start --scheme fitnessapp --clear 2>&1" Enter
sleep 15
tmux capture-pane -t expo-run -p | grep -E "Metro:|Waiting|808"
```

If Metro asks to use an alternative port, answer `Y`.

## Step 3 — Set ADB reverse

```bash
export PATH="$HOME/Android/Sdk/platform-tools:$PATH"
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

The dev client opens and downloads the bundle (~30 sec on first load).

## Step 5 — Verify

```bash
sleep 20
export PATH="$HOME/Android/Sdk/platform-tools:$PATH"
adb exec-out screencap -p > /tmp/app-screen.png
```

Read `/tmp/app-screen.png` — should show the login screen or home screen.

## Logs

```bash
# JS logs
export PATH="$HOME/Android/Sdk/platform-tools:$PATH"
adb logcat -s ReactNativeJS | grep -v "deprecated\|migration\|rnfirebase"

# Metro logs
tmux attach -t expo-run   # detach: Ctrl+B then D
```

## If the APK is not installed

Build a new dev APK via EAS (requires internet and EAS login):

```bash
eas build --platform android --profile development --no-wait
# Download and install the APK from the link on expo.dev (~15 min build time)
```

After installing, repeat Steps 3–5.

## Known issues

- **Black screen**: ADB reverse not set or Metro not running — repeat Steps 2–4.
- **"Failed to connect"**: Metro unreachable — check `tmux attach -t expo-run` and repeat Step 3.
- **Google Sign-In silently fails**: SHA-1 fingerprint not registered in Firebase Console → Project Settings → Android app → SHA certificate fingerprints.
