# 📱 Génération d'APK - Guide Rapide

## 🎯 Méthodes de génération

### Méthode 1: Script automatique (Recommandé)

**Windows (PowerShell):**
```powershell
.\build-apk.ps1
```

**Linux/Mac:**
```bash
chmod +x build-apk.sh
./build-apk.sh
```

### Méthode 2: Commandes manuelles

```bash
# 1. Build de l'application
ng build --configuration production

# 2. Synchronisation Capacitor
npx cap sync android

# 3. Génération APK
cd android
gradlew assembleDebug  # Windows
./gradlew assembleDebug  # Linux/Mac
```

### Méthode 3: Android Studio (Interface graphique)

```bash
# Ouvrir le projet dans Android Studio
npx cap open android

# Puis dans Android Studio:
# Build → Build Bundle(s) / APK(s) → Build APK(s)
```

## 📍 Localisation de l'APK

Après la génération, l'APK se trouve ici:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## 📲 Installation sur Android

1. Transférez le fichier `app-debug.apk` sur votre appareil
2. Activez "Installer depuis des sources inconnues" dans les paramètres
3. Ouvrez le fichier APK pour lancer l'installation

## 📋 Prérequis

- Java JDK 11+
- Android Studio (optionnel mais recommandé)
- Node.js et npm

## 📖 Guide complet

Pour plus de détails, consultez: [BUILD_APK_GUIDE.md](BUILD_APK_GUIDE.md)

## ⚡ Commandes utiles

```bash
# Ouvrir dans Android Studio
npx cap open android

# Voir les logs
adb logcat

# Lister les appareils connectés
adb devices

# Installer l'APK directement
adb install android/app/build/outputs/apk/debug/app-debug.apk
```
