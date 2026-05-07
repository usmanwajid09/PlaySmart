Get-ChildItem -Path 'C:\Users\shani\.gemini\antigravity\brain\193b7e06-e98e-4e62-91e7-86eada651b0a' -Filter '*.png' | Sort-Object Name | ForEach-Object { Write-Host "$($_.Name) $($_.Length)" }
