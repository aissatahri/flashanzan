#!/bin/bash

# Script de génération d'APK FlashAnzan
# Exécuter avec: ./build-apk.sh

echo "🚀 Début de la génération de l'APK FlashAnzan..."

# Étape 1: Build Angular en production
echo ""
echo "📦 Étape 1/3: Build de l'application Angular..."
ng build --configuration production

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build Angular"
    exit 1
fi

echo "✅ Build Angular terminé avec succès"

# Étape 2: Synchronisation Capacitor
echo ""
echo "🔄 Étape 2/3: Synchronisation avec Capacitor..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la synchronisation Capacitor"
    exit 1
fi

echo "✅ Synchronisation Capacitor terminée"

# Étape 3: Génération de l'APK
echo ""
echo "🔨 Étape 3/3: Génération de l'APK..."
cd android

# Générer l'APK de debug
./gradlew assembleDebug

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la génération de l'APK"
    cd ..
    exit 1
fi

cd ..

echo ""
echo "✅ APK généré avec succès!"
echo ""
echo "📱 L'APK se trouve ici:"
echo "   android/app/build/outputs/apk/debug/app-debug.apk"

echo ""
echo "💡 Pour installer l'APK sur un appareil:"
echo "   1. Transférez le fichier APK sur votre appareil Android"
echo "   2. Activez 'Sources inconnues' dans les paramètres"
echo "   3. Ouvrez le fichier APK pour l'installer"

echo ""
echo "🎉 Processus terminé!"
