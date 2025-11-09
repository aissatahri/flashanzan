# 📱 Guide Complet de Production d'APK - FlashAnzan

## 📋 Table des Matières
1. [Prérequis](#prérequis)
2. [Installation des Outils](#installation-des-outils)
3. [Configuration du Projet](#configuration-du-projet)
4. [Build de Production](#build-de-production)
5. [Génération de l'APK Debug](#génération-de-lapk-debug)
6. [Génération de l'APK Release (Signé)](#génération-de-lapk-release-signé)
7. [Installation et Test](#installation-et-test)
8. [Publication sur Google Play Store](#publication-sur-google-play-store)
9. [Dépannage](#dépannage)

---

## 1. Prérequis

### 1.1 Node.js et npm
- **Version requise**: Node.js 14+ et npm 6+
- **Vérification**:
  ```bash
  node --version
  npm --version
  ```
- **Installation**: https://nodejs.org/

### 1.2 Java JDK
- **Version requise**: JDK 11 ou supérieur
- **Vérification**:
  ```bash
  java -version
  javac -version
  ```
- **Installation**: https://www.oracle.com/java/technologies/downloads/
- **Configuration**:
  - Créer la variable d'environnement `JAVA_HOME`
  - Exemple: `C:\Program Files\Java\jdk-11.0.12`
  - Ajouter `%JAVA_HOME%\bin` au PATH

### 1.3 Android Studio (Recommandé)
- **Téléchargement**: https://developer.android.com/studio
- **Installation**: 
  - Installer Android Studio
  - Installer Android SDK (API Level 33 ou supérieur)
  - Installer Android SDK Build-Tools
  - Installer Android Emulator (optionnel)

### 1.4 Variables d'environnement
Configurer ces variables système:
- **ANDROID_HOME**: `C:\Users\VotreNom\AppData\Local\Android\Sdk`
- **PATH**: Ajouter:
  - `%ANDROID_HOME%\platform-tools`
  - `%ANDROID_HOME%\tools`
  - `%ANDROID_HOME%\tools\bin`

### 1.5 Gradle (Automatique)
Gradle sera automatiquement téléchargé lors du premier build.

---

## 2. Installation des Outils

### 2.1 Installer Angular CLI
```bash
npm install -g @angular/cli
```

### 2.2 Installer les dépendances du projet
```bash
cd D:\Project_Angular\flashanzan
npm install
```

### 2.3 Installer Capacitor
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### 2.4 Vérifier l'installation
```bash
npx cap --version
```

---

## 3. Configuration du Projet

### 3.1 Vérifier capacitor.config.ts
Fichier: `capacitor.config.ts`
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flashanzan.app',
  appName: 'FlashAnzan',
  webDir: 'dist/flashanzan-app'
};

export default config;
```

**Points importants**:
- `appId`: Identifiant unique (format: com.domaine.app)
- `appName`: Nom affiché sur l'appareil
- `webDir`: Dossier contenant le build Angular

### 3.2 Vérifier angular.json (Budgets)
Fichier: `angular.json` (lignes 32-43)
```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "2mb",
    "maximumError": "5mb"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "20kb",
    "maximumError": "50kb"
  }
]
```

### 3.3 Ajouter la plateforme Android (si pas déjà fait)
```bash
npx cap add android
```

**Note**: Si le dossier `android` existe déjà, cette étape n'est pas nécessaire.

---

## 4. Build de Production

### 4.1 Nettoyer les anciens builds (optionnel)
```bash
# Windows PowerShell
Remove-Item -Recurse -Force dist
Remove-Item -Recurse -Force android\app\build

# Linux/Mac
rm -rf dist
rm -rf android/app/build
```

### 4.2 Build Angular en mode production
```bash
ng build --configuration production
```

**Résultat attendu**:
```
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.

Build at: 2025-11-03T22:08:50.840Z
Time: ~7-15 seconds
```

**Vérification**:
- Dossier créé: `dist/flashanzan-app/`
- Fichiers présents: `index.html`, `main.*.js`, `polyfills.*.js`, `styles.*.css`

### 4.3 Synchroniser avec Capacitor
```bash
npx cap sync android
```

**Ce que fait cette commande**:
1. Copie les fichiers web vers `android/app/src/main/assets/public`
2. Met à jour la configuration Capacitor
3. Met à jour les plugins Android

**Résultat attendu**:
```
✔ Copying web assets
✔ Creating capacitor.config.json
✔ copy android
✔ Updating Android plugins
✔ update android
[info] Sync finished in 0.xxx s
```

---

## 5. Génération de l'APK Debug

### 5.1 Méthode Automatique (Script PowerShell)

**Étape 1**: Créer le script `build-apk.ps1` (déjà créé)

**Étape 2**: Exécuter le script
```powershell
.\build-apk.ps1
```

**Le script effectue**:
1. Build Angular production
2. Sync Capacitor
3. Compilation Gradle → APK debug

**Résultat**:
```
APK genere avec succes!
L'APK se trouve ici:
   android\app\build\outputs\apk\debug\app-debug.apk
```

### 5.2 Méthode Manuelle (Ligne de commande)

**Étape 1**: Naviguer vers le dossier android
```bash
cd android
```

**Étape 2**: Générer l'APK
```bash
# Windows
gradlew.bat assembleDebug

# Linux/Mac
./gradlew assembleDebug
```

**Étape 3**: Retourner au dossier racine
```bash
cd ..
```

**Durée**: 5-10 minutes (première fois), 1-3 minutes (builds suivants)

### 5.3 Méthode Android Studio (Interface Graphique)

**Étape 1**: Ouvrir le projet Android
```bash
npx cap open android
```

**Étape 2**: Dans Android Studio
1. Attendre la synchronisation Gradle (barre de progression en bas)
2. Menu: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
3. Attendre la notification "APK(s) generated successfully"
4. Cliquer sur "locate" pour ouvrir le dossier

**Étape 3**: Localiser l'APK
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 6. Génération de l'APK Release (Signé)

### 6.1 Créer un Keystore

**Étape 1**: Créer le keystore (une seule fois)
```bash
keytool -genkey -v -keystore flashanzan-release.keystore -alias flashanzan -keyalg RSA -keysize 2048 -validity 10000
```

**Questions posées**:
- **Mot de passe du keystore**: (choisir un mot de passe fort)
- **Votre nom et prénom**: Votre nom
- **Nom de votre unité organisationnelle**: Développement
- **Nom de votre organisation**: Votre entreprise
- **Nom de la ville**: Votre ville
- **Nom de votre État**: Votre état/province
- **Code pays (2 lettres)**: DZ (par exemple)

**⚠️ IMPORTANT**: 
- Sauvegarder le fichier `.keystore` en lieu sûr
- Noter le mot de passe (ne jamais le perdre)
- Faire une copie de sauvegarde

**Étape 2**: Déplacer le keystore
```bash
# Le placer dans le dossier racine du projet
move flashanzan-release.keystore D:\Project_Angular\flashanzan\
```

### 6.2 Configurer la signature

**Étape 1**: Créer le fichier `android/key.properties`
```properties
storePassword=VOTRE_MOT_DE_PASSE_KEYSTORE
keyPassword=VOTRE_MOT_DE_PASSE_KEY
keyAlias=flashanzan
storeFile=../flashanzan-release.keystore
```

**⚠️ SÉCURITÉ**: 
- Ajouter `key.properties` au `.gitignore`
- Ne jamais committer ce fichier sur GitHub

**Étape 2**: Modifier `android/app/build.gradle`

Ajouter avant `android {`:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Ajouter dans `android { ... }`:
```gradle
android {
    ...
    
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 6.3 Générer l'APK Release

**Méthode 1: Ligne de commande**
```bash
cd android
gradlew.bat assembleRelease
cd ..
```

**Méthode 2: Android Studio**
1. Ouvrir le projet: `npx cap open android`
2. Menu: `Build` → `Generate Signed Bundle / APK`
3. Sélectionner: `APK`
4. Cliquer: `Next`
5. Remplir:
   - **Key store path**: Chemin vers `flashanzan-release.keystore`
   - **Key store password**: Votre mot de passe keystore
   - **Key alias**: flashanzan
   - **Key password**: Votre mot de passe key
6. Cliquer: `Next`
7. Sélectionner: `release`
8. Cliquer: `Finish`

**Localisation de l'APK signé**:
```
android/app/build/outputs/apk/release/app-release.apk
```

**Taille du fichier**: ~3-5 MB (selon optimisations)

---

## 7. Installation et Test

### 7.1 Sur un appareil physique (USB)

**Prérequis**:
1. Activer le **Mode développeur** sur Android:
   - Paramètres → À propos du téléphone
   - Tapoter 7 fois sur "Numéro de build"
2. Activer le **Débogage USB**:
   - Paramètres → Options pour les développeurs
   - Activer "Débogage USB"

**Installation**:
```bash
# Vérifier que l'appareil est détecté
adb devices

# Installer l'APK
adb install android\app\build\outputs\apk\debug\app-debug.apk

# Ou pour remplacer une version existante
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

### 7.2 Sur un appareil physique (Manuel)

1. Transférer le fichier APK sur l'appareil:
   - Par USB (copier dans le dossier Téléchargements)
   - Par email (s'envoyer l'APK)
   - Par cloud (Google Drive, Dropbox, etc.)

2. Sur l'appareil Android:
   - Ouvrir le gestionnaire de fichiers
   - Localiser le fichier `app-debug.apk`
   - Appuyer dessus pour lancer l'installation
   - Accepter les permissions

**Note**: Si "Installation bloquée", aller dans:
- Paramètres → Sécurité → Autoriser l'installation depuis des sources inconnues

### 7.3 Sur un émulateur Android

**Étape 1**: Démarrer un émulateur
```bash
# Lister les émulateurs disponibles
emulator -list-avds

# Démarrer un émulateur
emulator -avd NOM_EMULATEUR
```

**Étape 2**: Installer l'APK
```bash
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

**Ou**: Glisser-déposer l'APK sur la fenêtre de l'émulateur

### 7.4 Tester l'application

**Vérifications importantes**:
- ✅ L'application démarre sans erreur
- ✅ L'interface est responsive (portrait/paysage)
- ✅ Les sons fonctionnent
- ✅ Le changement de langue fonctionne
- ✅ Les paramètres personnalisés s'enregistrent
- ✅ Le jeu fonctionne correctement
- ✅ Les modals s'affichent correctement
- ✅ Le focus clavier fonctionne
- ✅ Les animations sont fluides
- ✅ L'application fonctionne hors ligne

**Voir les logs en temps réel**:
```bash
adb logcat | findstr "FlashAnzan"
```

---

## 8. Publication sur Google Play Store

### 8.1 Prérequis

1. **Compte développeur Google Play**:
   - Coût: 25$ (paiement unique)
   - Inscription: https://play.google.com/console/signup

2. **APK/AAB signé en release**:
   - Utiliser l'APK release généré précédemment
   - Ou générer un Android App Bundle (.aab) - recommandé

### 8.2 Générer un App Bundle (.aab) - Recommandé

**Pourquoi AAB plutôt qu'APK**:
- Taille de téléchargement réduite
- Optimisations automatiques par Google Play
- Format requis pour les nouvelles applications

**Générer le bundle**:
```bash
cd android
gradlew.bat bundleRelease
cd ..
```

**Localisation**:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### 8.3 Préparer les ressources

**Icône de l'application**:
- Taille: 512x512 pixels
- Format: PNG (32 bits)
- Pas de transparence
- Emplacement: Créer `icon-512x512.png`

**Captures d'écran**:
Minimum requis:
- 2 captures pour téléphones (16:9 ou 9:16)
- Tailles acceptées: 320px - 3840px
- Formats: JPG ou PNG 24 bits

Recommandé: Créer 4-8 captures montrant:
1. Écran d'accueil
2. Sélection de difficulté
3. Jeu en cours
4. Paramètres personnalisés
5. Modal de résultats

**Bannière**:
- Taille: 1024x500 pixels
- Format: PNG ou JPG

### 8.4 Processus de publication

**Étape 1**: Créer l'application dans la Console
1. Aller sur: https://play.google.com/console
2. Cliquer: "Créer une application"
3. Remplir:
   - Nom: FlashAnzan
   - Langue par défaut: Français
   - Type: Application
   - Gratuit/Payant: Gratuit

**Étape 2**: Configuration de l'application
1. **Fiche du Play Store**:
   - Description courte (80 caractères max)
   - Description complète (4000 caractères max)
   - Captures d'écran (min 2, max 8)
   - Icône (512x512)
   - Bannière graphique

2. **Catégorie**:
   - Catégorie: Éducation
   - Sous-catégorie: Calcul mental

3. **Classification du contenu**:
   - Remplir le questionnaire
   - Pour FlashAnzan: Tous publics

4. **Coordonnées**:
   - Email de contact
   - Site web (optionnel)
   - Politique de confidentialité (obligatoire)

**Étape 3**: Télécharger l'APK/AAB
1. Aller dans: "Production" → "Versions"
2. Cliquer: "Créer une version"
3. Télécharger: `app-release.aab`
4. Remplir les notes de version
5. Examiner et déployer

**Étape 4**: Soumission
1. Vérifier tous les points verts ✅
2. Soumettre pour examen
3. Attendre la validation (1-7 jours)

### 8.5 Mises à jour futures

Pour publier une mise à jour:

1. **Incrémenter la version** dans `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        versionCode 2  // Incrémenter de 1
        versionName "1.1.0"  // Nouvelle version
    }
}
```

2. **Reconstruire**:
```bash
ng build --configuration production
npx cap sync android
cd android
gradlew.bat bundleRelease
```

3. **Télécharger le nouveau AAB** dans la console

---

## 9. Dépannage

### 9.1 Erreur: "JAVA_HOME not set"

**Solution**:
```powershell
# Vérifier JAVA_HOME
echo $env:JAVA_HOME

# Définir JAVA_HOME (temporaire)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-11.0.12"

# Définir JAVA_HOME (permanent)
# Panneau de configuration → Système → Paramètres système avancés
# → Variables d'environnement → Nouvelle variable système
```

### 9.2 Erreur: "SDK location not found"

**Solution**: Créer `android/local.properties`
```properties
sdk.dir=C\:\\Users\\VotreNom\\AppData\\Local\\Android\\Sdk
```

### 9.3 Erreur: "Build failed" - Gradle

**Solutions**:
```bash
# Nettoyer le cache Gradle
cd android
gradlew clean

# Forcer le téléchargement des dépendances
gradlew build --refresh-dependencies

# Vérifier la connexion internet (Gradle télécharge beaucoup)
```

### 9.4 Erreur: "webDir not found"

**Solution**: Vérifier que le build existe
```bash
# Vérifier que dist/flashanzan-app existe
ls dist/flashanzan-app

# Si absent, rebuild
ng build --configuration production
```

### 9.5 L'application crash au démarrage

**Solution**: Voir les logs
```bash
adb logcat | findstr "AndroidRuntime"
```

**Causes communes**:
- Plugin Capacitor manquant
- Erreur JavaScript dans le code
- Permissions manquantes

### 9.6 APK trop volumineux (>100MB)

**Solutions**:
1. Activer ProGuard (minification)
2. Utiliser App Bundle (.aab) au lieu d'APK
3. Optimiser les images
4. Supprimer les dépendances inutilisées

### 9.7 Erreur de signature (APK Release)

**Vérifications**:
```bash
# Vérifier que le keystore existe
ls flashanzan-release.keystore

# Vérifier key.properties
cat android/key.properties

# Tester le keystore
keytool -list -v -keystore flashanzan-release.keystore
```

---

## 10. Commandes de Référence Rapide

```bash
# Build complet (développement)
ng build

# Build production
ng build --configuration production

# Sync Capacitor
npx cap sync android

# Générer APK debug
cd android && gradlew assembleDebug && cd ..

# Générer APK release
cd android && gradlew assembleRelease && cd ..

# Générer AAB release
cd android && gradlew bundleRelease && cd ..

# Ouvrir dans Android Studio
npx cap open android

# Installer sur appareil
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Voir les logs
adb logcat

# Lister appareils connectés
adb devices

# Script automatique (tout en un)
.\build-apk.ps1
```

---

## 11. Checklist de Production

### Avant de générer l'APK final:

- [ ] Tests complets effectués
- [ ] Toutes les fonctionnalités testées
- [ ] Interface responsive vérifiée
- [ ] Multilingue testé (AR, FR, EN)
- [ ] Sons testés
- [ ] Performance acceptable
- [ ] Pas d'erreurs dans les logs
- [ ] Version incrémentée dans build.gradle
- [ ] Keystore en lieu sûr
- [ ] key.properties configuré
- [ ] build.gradle modifié pour signature
- [ ] Icônes de l'app créées (toutes tailles)
- [ ] Captures d'écran préparées
- [ ] Description Play Store rédigée
- [ ] Politique de confidentialité créée

### Après génération:

- [ ] APK/AAB testé sur plusieurs appareils
- [ ] Différentes versions Android testées (min: 7.0)
- [ ] Installation depuis fichier testée
- [ ] Mise à jour testée (si v2+)
- [ ] Désinstallation propre vérifiée

---

## 12. Ressources Utiles

### Documentation officielle:
- **Capacitor**: https://capacitorjs.com/docs
- **Android Studio**: https://developer.android.com/studio/build
- **Gradle**: https://gradle.org/
- **Google Play Console**: https://support.google.com/googleplay/android-developer

### Outils:
- **APK Analyzer** (Android Studio): Analyser la taille de l'APK
- **ADB**: https://developer.android.com/studio/command-line/adb
- **Logcat**: Voir les logs Android

### Communauté:
- **Stack Overflow**: Tag `capacitor`, `android`, `angular`
- **Forum Ionic**: https://forum.ionicframework.com/

---

## 📌 Notes Finales

**Version de ce guide**: 1.0.0  
**Date**: 3 Novembre 2025  
**Projet**: FlashAnzan - Application de calcul mental  
**Plateforme**: Android  
**Framework**: Angular 14 + Capacitor 6  

**Auteur**: Guide créé pour le projet FlashAnzan

---

**⚠️ Rappels importants**:
1. Toujours tester sur un appareil réel avant publication
2. Garder le keystore en sécurité (impossible à récupérer si perdu)
3. Incrémenter versionCode à chaque mise à jour
4. Respecter les règles du Google Play Store
5. Fournir une politique de confidentialité même pour les apps gratuites

**✅ Bonne chance pour la publication de votre application !**
