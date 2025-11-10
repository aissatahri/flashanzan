# Script pour générer le favicon depuis l'icône FlashAnzan

Write-Host "🎨 Génération du favicon..." -ForegroundColor Cyan

Add-Type -AssemblyName System.Drawing

$sourceIcon = "src\icon-flashanzan-bis.png"
$faviconPath = "src\favicon.png"
$faviconIcoPath = "src\favicon.ico"

if (-not (Test-Path $sourceIcon)) {
    Write-Host "❌ Erreur: Fichier source introuvable: $sourceIcon" -ForegroundColor Red
    exit 1
}

# Charger l'image source
Write-Host "📥 Chargement de l'image source..." -ForegroundColor Yellow
$image = [System.Drawing.Image]::FromFile((Resolve-Path $sourceIcon))

# Créer le favicon PNG 32x32
Write-Host "🖼️  Création du favicon PNG (32x32)..." -ForegroundColor Yellow
$favicon32 = New-Object System.Drawing.Bitmap(32, 32)
$graphics = [System.Drawing.Graphics]::FromImage($favicon32)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.DrawImage($image, 0, 0, 32, 32)
$favicon32.Save((Join-Path (Get-Location) $faviconPath), [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$favicon32.Dispose()

# Créer également un ICO 16x16 pour compatibilité
Write-Host "🖼️  Création du favicon ICO (16x16)..." -ForegroundColor Yellow
$favicon16 = New-Object System.Drawing.Bitmap(16, 16)
$graphics16 = [System.Drawing.Graphics]::FromImage($favicon16)
$graphics16.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics16.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics16.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics16.DrawImage($image, 0, 0, 16, 16)

# Sauvegarder en ICO
$memoryStream = New-Object System.IO.MemoryStream
$favicon16.Save($memoryStream, [System.Drawing.Imaging.ImageFormat]::Png)
$favicon16Bytes = $memoryStream.ToArray()

# Créer le fichier ICO manuellement
$icoStream = [System.IO.File]::Create((Join-Path (Get-Location) $faviconIcoPath))
# En-tête ICO
$icoStream.Write([byte[]](0, 0, 1, 0, 1, 0), 0, 6)
# ICONDIRENTRY
$icoStream.WriteByte(16) # largeur
$icoStream.WriteByte(16) # hauteur
$icoStream.WriteByte(0)  # palette
$icoStream.WriteByte(0)  # réservé
$icoStream.Write([byte[]](1, 0), 0, 2) # color planes
$icoStream.Write([byte[]](32, 0), 0, 2) # bits per pixel
$size = [BitConverter]::GetBytes([int32]$favicon16Bytes.Length)
$icoStream.Write($size, 0, 4) # taille
$icoStream.Write([byte[]](22, 0, 0, 0), 0, 4) # offset
# Données PNG
$icoStream.Write($favicon16Bytes, 0, $favicon16Bytes.Length)
$icoStream.Close()

$graphics16.Dispose()
$favicon16.Dispose()
$memoryStream.Dispose()
$image.Dispose()

Write-Host "✅ Favicons créés avec succès!" -ForegroundColor Green
Write-Host "   - $faviconPath (PNG 32x32)" -ForegroundColor White
Write-Host "   - $faviconIcoPath (ICO 16x16)" -ForegroundColor White
