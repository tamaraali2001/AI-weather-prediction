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

ffmpeg -i home1.mp4 -vf "scale=1920:-1:flags=lanczos" -loop 0 -lossless 1 home1.webp

## Fix 

ffmpeg -i home1.mp4  -vf "scale=1920:-1:flags=lanczos"  -loop 0 -q:v 80 -compression_level 6 home1.webp

===========================================

## steps:

# تثبيت nvm-windows أولاً (ملف ‎.exe‎ من GitHub)
nvm install 18.19.0
nvm use 18.19.0

rd /s /q node_modules      # حذف المجلد القديم
del package-lock.json
npm install
npm start
