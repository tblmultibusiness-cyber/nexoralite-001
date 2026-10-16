#!/usr/bin/env bash
# Build a debug APK for Nexora Browser 001
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> npm install"
npm install

echo "==> vite build"
npm run build

if [ ! -d android ]; then
  echo "==> cap add android"
  npx cap add android
fi

echo "==> cap sync"
npx cap sync android

export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-17-openjdk-amd64}"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

echo "==> gradle assembleDebug"
cd android
chmod +x gradlew
./gradlew assembleDebug

APK="$ROOT/android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "APK ready:"
echo "  $APK"
echo "Install: adb install -r $APK"
