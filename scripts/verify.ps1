Get-ChildItem 'C:\Data\PlaySmart\*.docx' | ForEach-Object { 
    $size = [math]::Round($_.Length/1024)
    Write-Host "$($_.Name) - $size KB" 
}
