# Script pour mettre à jour toutes les icônes Android à partir de play_store_512.png
# Utilise la bibliothèque System.Drawing pour redimensionner les images

Add-Type -AssemblyName System.Drawing

$sourceImage = "D:\Project_Angular\flashanzan\android\app\src\main\res\play_store_512.png"
$resFolder = "D:\Project_Angular\flashanzan\android\app\src\main\res"

# Vérifier que le fichier source existe
if (-not (Test-Path $sourceImage)) {
    Write-Host "ERREUR: Le fichier source $sourceImage n'existe pas!" -ForegroundColor Red
    exit 1
}

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Mise à jour des icônes Android - FlashAnzan" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Charger l'image source
$img = [System.Drawing.Image]::FromFile($sourceImage)
Write-Host "[OK] Image source chargée: $sourceImage" -ForegroundColor Green
Write-Host "     Dimensions: $($img.Width)x$($img.Height) pixels" -ForegroundColor Gray
Write-Host ""

# Fonction pour redimensionner et sauvegarder une image
function Resize-Image {
    param (
        [System.Drawing.Image]$sourceImg,
        [int]$width,
        [int]$height,
        [string]$outputPath
    )
    
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Qualité maximale
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $graphics.DrawImage($sourceImg, 0, 0, $width, $height)
    
    # Sauvegarder en PNG
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $bitmap.Dispose()
}

# Définir les tailles pour chaque densité
$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

Write-Host "Redimensionnement et remplacement des icônes..." -ForegroundColor Yellow
Write-Host ""

# Pour chaque densité
foreach ($folder in $sizes.Keys) {
    $size = $sizes[$folder]
    $folderPath = Join-Path $resFolder $folder
    
    # Créer le dossier s'il n'existe pas
    if (-not (Test-Path $folderPath)) {
        New-Item -ItemType Directory -Path $folderPath -Force | Out-Null
    }
    
    # Générer ic_launcher.png
    $launcherPath = Join-Path $folderPath "ic_launcher.png"
    Resize-Image -sourceImg $img -width $size -height $size -outputPath $launcherPath
    Write-Host "  [✓] $folder/ic_launcher.png ($size x $size)" -ForegroundColor Green
    
    # Générer ic_launcher_round.png (même image)
    $roundPath = Join-Path $folderPath "ic_launcher_round.png"
    Copy-Item $launcherPath $roundPath -Force
    Write-Host "  [✓] $folder/ic_launcher_round.png ($size x $size)" -ForegroundColor Green
    
    # Générer ic_launcher_foreground.png (même image)
    $foregroundPath = Join-Path $folderPath "ic_launcher_foreground.png"
    Copy-Item $launcherPath $foregroundPath -Force
    Write-Host "  [✓] $folder/ic_launcher_foreground.png ($size x $size)" -ForegroundColor Green
}

# Nettoyer
$img.Dispose()

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Mise à jour terminée avec succès!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Yellow
Write-Host "  1. Reconstruire l'AAB: cd android; .\gradlew bundleRelease" -ForegroundColor White
Write-Host "  2. Committer les changements: git add .; git commit -m 'fix: icons'" -ForegroundColor White
Write-Host "  3. Soumettre sur Google Play Store" -ForegroundColor White
Write-Host ""
