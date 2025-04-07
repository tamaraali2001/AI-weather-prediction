# AI-weather-prediction

# Using PowerShell to get all path files with content, excluding "package-lock.json" and "node_modules" and "venv"

$outputFilePath = "all_files_with_content.txt"
if (Test-Path $outputFilePath) {
    Remove-Item $outputFilePath
}
Get-ChildItem -Path "C:\Users\progr\Documents\GitHub\AI-weather-prediction" -Recurse -File |
Where-Object {
    $_.Name -ne "package-lock.json" -and
    $_.Name -ne "favicon.ico" -and
    -not ($_.FullName -like "\*\node_modules\*") -and
-not ($_.FullName -like "_\venv\*") -and
-not ($\_.FullName -like "_\assets\*") -and
-not ($_.FullName -like "*\node\*") -and
    -not ($_.FullName -like "\*\logs\*") -and
-not ($_.FullName -like "_\fixtures\*") -and
-not ($\_.FullName -like "_\__pycache\_\_\*")
} | ForEach-Object {
"=== $($_.FullName) ===" | Out-File -FilePath $outputFilePath -Encoding UTF8 -Append
Get-Content $\_.FullName | Out-File -FilePath $outputFilePath -Encoding UTF8 -Append
}

==========================================

## steps:

npm install
npm start
