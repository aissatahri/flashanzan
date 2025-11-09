# Script de generation d'APK FlashAnzan
# Executer avec: .\build-apk.ps1

Write-Host "Debut de la generation de l'APK FlashAnzan..." -ForegroundColor Green

# Etape 1: Build Angular en production
Write-Host "`nEtape 1/3: Build de l'application Angular..." -ForegroundColor Cyan
ng build --configuration production

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur lors du build Angular" -ForegroundColor Red
    exit 1
}

Write-Host "Build Angular termine avec succes" -ForegroundColor Green

# Etape 2: Synchronisation Capacitor
Write-Host "`nEtape 2/3: Synchronisation avec Capacitor..." -ForegroundColor Cyan
npx cap sync android

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur lors de la synchronisation Capacitor" -ForegroundColor Red
    exit 1
}

Write-Host "Synchronisation Capacitor terminee" -ForegroundColor Green

# Etape 3: Generation de l'APK
Write-Host "`nEtape 3/3: Generation de l'APK..." -ForegroundColor Cyan
Set-Location android

# Generer l'APK de debug
.\gradlew.bat assembleDebug

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur lors de la generation de l'APK" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

Write-Host "`nAPK genere avec succes!" -ForegroundColor Green
Write-Host "`nL'APK se trouve ici:" -ForegroundColor Yellow
Write-Host "   android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White

Write-Host "`nPour installer l'APK sur un appareil:" -ForegroundColor Cyan
Write-Host "   1. Transferez le fichier APK sur votre appareil Android" -ForegroundColor White
Write-Host "   2. Activez 'Sources inconnues' dans les parametres" -ForegroundColor White
Write-Host "   3. Ouvrez le fichier APK pour l'installer" -ForegroundColor White

Write-Host "`nProcessus termine!" -ForegroundColor Green
