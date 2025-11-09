# Guide de génération d'APK pour FlashAnzan

## 📋 Prérequis

1. **Java JDK** (version 11 ou supérieure)
   - Télécharger: https://www.oracle.com/java/technologies/downloads/
   - Vérifier: `java -version`

2. **Android Studio**
   - Télécharger: https://developer.android.com/studio
   - Installer avec Android SDK

3. **Variables d'environnement**
   - JAVA_HOME pointant vers le JDK
   - ANDROID_HOME pointant vers le SDK Android

## 🔨 Étapes de génération d'APK

### Option 1: Via Android Studio (Recommandé)

1. **Ouvrir le projet dans Android Studio**
   ```bash
   npx cap open android
   ```

2. **Attendre la synchronisation Gradle**
   - Android Studio va télécharger les dépendances nécessaires
   - Cela peut prendre quelques minutes la première fois

3. **Générer l'APK de debug**
   - Menu: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - L'APK sera généré dans: `android/app/build/outputs/apk/debug/app-debug.apk`

4. **Générer l'APK de release (pour production)**
   - Menu: `Build` → `Generate Signed Bundle / APK`
   - Sélectionner `APK`
   - Créer un nouveau keystore ou utiliser un existant
   - Suivre les étapes de signature
   - L'APK signé sera dans: `android/app/build/outputs/apk/release/`

### Option 2: Via ligne de commande

1. **Naviguer vers le dossier android**
   ```bash
   cd android
   ```

2. **Générer l'APK de debug**
   ```bash
   ./gradlew assembleDebug
   ```
   Ou sur Windows:
   ```bash
   gradlew.bat assembleDebug
   ```

3. **Générer l'APK de release**
   ```bash
   ./gradlew assembleRelease
   ```

4. **Localiser l'APK**
   - Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Release: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## 🔐 Signature de l'APK (pour release)

### Créer un keystore

```bash
keytool -genkey -v -keystore flashanzan-release.keystore -alias flashanzan -keyalg RSA -keysize 2048 -validity 10000
```

### Configurer la signature

1. Créer le fichier `android/key.properties`:
```properties
storePassword=VOTRE_MOT_DE_PASSE
keyPassword=VOTRE_MOT_DE_PASSE
keyAlias=flashanzan
storeFile=../flashanzan-release.keystore
```

2. Modifier `android/app/build.gradle` pour inclure:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

## 📱 Installation de l'APK

### Sur un appareil physique
1. Activer le mode développeur sur l'appareil Android
2. Activer "Installation depuis des sources inconnues"
3. Transférer l'APK sur l'appareil
4. Ouvrir le fichier APK pour l'installer

### Sur un émulateur
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## 🔄 Workflow complet de mise à jour

1. **Modifier le code Angular**
2. **Build de production**
   ```bash
   ng build --configuration production
   ```

3. **Synchroniser avec Capacitor**
   ```bash
   npx cap sync android
   ```

4. **Générer l'APK**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   Ou ouvrir dans Android Studio

## 📦 Personnalisation de l'application

### Icône de l'application
- Placer vos icônes dans: `android/app/src/main/res/mipmap-*`
- Tailles recommandées:
  - mdpi: 48x48
  - hdpi: 72x72
  - xhdpi: 96x96
  - xxhdpi: 144x144
  - xxxhdpi: 192x192

### Nom de l'application
Modifier dans `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">FlashAnzan</string>
```

### Permissions
Modifier dans `android/app/src/main/AndroidManifest.xml`

## ⚠️ Problèmes courants

### Gradle Build Failed
- Vérifier la connexion internet
- Vérifier JAVA_HOME et ANDROID_HOME
- Nettoyer le cache: `cd android && ./gradlew clean`

### APK trop volumineux
- Activer ProGuard pour minifier le code
- Utiliser App Bundle (.aab) au lieu d'APK

### Application crash au démarrage
- Vérifier les logs: `adb logcat`
- S'assurer que tous les plugins Capacitor sont installés

## 📤 Publication sur Google Play Store

1. Générer un APK signé ou un App Bundle (.aab)
2. Créer un compte développeur Google Play (25$ unique)
3. Créer une nouvelle application
4. Remplir les informations de l'app
5. Télécharger l'APK/AAB
6. Soumettre pour révision

## 🔗 Ressources utiles

- Documentation Capacitor: https://capacitorjs.com/docs
- Guide Android Studio: https://developer.android.com/studio/build
- Capacitor Android: https://capacitorjs.com/docs/android

---

**Version actuelle de l'application:** FlashAnzan v1.0.0  
**Build configuré avec:** Angular 14 + Capacitor 6
