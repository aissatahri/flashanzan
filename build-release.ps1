# Script de generation de l'App Bundle signe pour Google Play Store
# FlashAnzan - Version Release

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Generation App Bundle Release - FlashAnzan" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Etape 1: Build Angular en mode production
Write-Host "[1/3] Build Angular en production..." -ForegroundColor Yellow
ng build --configuration production
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Echec du build Angular!" -ForegroundColor Red
    exit 1
}
Write-Host "Build Angular termine avec succes!" -ForegroundColor Green
Write-Host ""

# Etape 2: Synchronisation avec Capacitor
Write-Host "[2/3] Synchronisation Capacitor..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Echec de la synchronisation Capacitor!" -ForegroundColor Red
    exit 1
}
Write-Host "Synchronisation terminee avec succes!" -ForegroundColor Green
Write-Host ""

# Etape 3: Generation de l'App Bundle signe
Write-Host "[3/3] Generation de l'App Bundle signe (.aab)..." -ForegroundColor Yellow
Set-Location android
.\gradlew.bat bundleRelease
$gradleExitCode = $LASTEXITCODE
Set-Location ..

if ($gradleExitCode -ne 0) {
    Write-Host "ERREUR: Echec de la generation de l'App Bundle!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  App Bundle genere avec succes!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "L'App Bundle signe se trouve ici:" -ForegroundColor Cyan
Write-Host "   android\app\build\outputs\bundle\release\app-release.aab" -ForegroundColor White
Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Yellow
Write-Host "  1. Aller sur https://play.google.com/console" -ForegroundColor White
Write-Host "  2. Creer une nouvelle application" -ForegroundColor White
Write-Host "  3. Telecharger le fichier app-release.aab" -ForegroundColor White
Write-Host "  4. Remplir les informations de l'application" -ForegroundColor White
Write-Host "  5. Soumettre pour examen" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANT: Gardez le fichier flashanzan-release.keystore en securite!" -ForegroundColor Red
Write-Host "           Vous en aurez besoin pour les futures mises a jour." -ForegroundColor Red
Write-Host ""
