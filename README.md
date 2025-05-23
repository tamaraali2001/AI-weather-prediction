# AI-weather-prediction

# Using PowerShell to get all path files with content, excluding "package-lock.json" and "node_modules" and "venv"

$outputFilePath = "all_files_with_content.txt"
if (Test-Path $outputFilePath) {
    Remove-Item $outputFilePath
}
Get-ChildItem -Path "C:\Users\YASSER\Documents\GitHub\AI-weather-prediction" -Recurse -File |
Where-Object {
    $_.Name -ne "package-lock.json" -and
    $_.Name -ne "favicon.ico" -and
    $_.Name -ne "future_weather_predictions.csv" -and
    -not ($_.FullName -like "*\node_modules\*") -and
    -not ($_.FullName -like "*\venv\*") -and
    -not ($_.FullName -like "*\assets\*") -and
    -not ($_.FullName -like "*\node\*") -and
    -not ($_.FullName -like "*\logs\*") -and
    -not ($_.FullName -like "*\fixtures\*") -and
    -not ($_.FullName -like "*\__pycache__\*")
} | ForEach-Object {
    "=== $($_.FullName) ===" | Out-File -FilePath $outputFilePath -Encoding UTF8 -Append
    Get-Content $_.FullName | Out-File -FilePath $outputFilePath -Encoding UTF8 -Append
}



=========================================
## لتجربة أقصى جودة، جرب هذا بدون ضغط:

ffmpeg -i sunny.mp4 -vf "scale=1920:-1:flags=lanczos" -loop 0 -lossless 1 sunny.webp

==========================================
# 🔄 سكربت لتحويل كل ملفات .mp4 في المجلد إلى WebP بجودة فائقة بدون تغويش

$inputFolder = "C:\Users\YASSER\Videos\weather_videos"
$outputFolder = "C:\Users\YASSER\Videos\webp_outputs"
New-Item -ItemType Directory -Force -Path $outputFolder | Out-Null

Get-ChildItem -Path $inputFolder -Filter *.mp4 | ForEach-Object {
    $inputFile = $_.FullName
    $outputFile = Join-Path $outputFolder ($_.BaseName + "_ultra.webp")

    Write-Host "🚀 جاري تحويل: $($_.Name) إلى WebP بأقصى وضوح..."

    ffmpeg -i $inputFile -vf "fps=24,scale=1920:-1:flags=lanczos" `
    -loop 0 `
    -quality 90 `
    -compression_level 4 `
    -lossless 0 `
    -preset picture `
    $outputFile
}

Write-Host "✅ تم تحويل جميع الفيديوهات بجودة عالية جداً!"

===========================================

## steps:

npm install
npm start
