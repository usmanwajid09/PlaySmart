# Extract screen IDs, titles, and screenshot URLs from latest screen listing
$content = Get-Content 'C:\Users\shani\.gemini\antigravity\brain\193b7e06-e98e-4e62-91e7-86eada651b0a\.system_generated\steps\144\output.txt' -Raw

# Get screen names/IDs
$nameMatches = [regex]::Matches($content, '"name":"projects/12363635124012461076/screens/([^"]+)"')
$titleMatches = [regex]::Matches($content, '"title":"([^"]+)"')
$screenshotMatches = [regex]::Matches($content, '"downloadUrl":"(https://lh3\.googleusercontent\.com/[^"]+)"')

Write-Host "=== EXISTING SCREENS ==="
for ($i = 0; $i -lt $titleMatches.Count; $i++) {
    $id = if ($i -lt $nameMatches.Count) { $nameMatches[$i].Groups[1].Value } else { "N/A" }
    $title = $titleMatches[$i].Groups[1].Value
    Write-Host "$($i+1). $title | ID: $id"
}

# Also check new screen outputs
Write-Host ""
Write-Host "=== NEW SCREENS ==="
$steps = @(135, 136, 137, 140, 141)
foreach ($step in $steps) {
    $path = "C:\Users\shani\.gemini\antigravity\brain\193b7e06-e98e-4e62-91e7-86eada651b0a\.system_generated\steps\$step\output.txt"
    if (Test-Path $path) {
        $c = Get-Content $path -Raw
        $t = [regex]::Match($c, '"title":"([^"]+)"')
        $id = [regex]::Match($c, '"id":"([^"]+)"')
        if ($t.Success) {
            Write-Host "Step $step : $($t.Groups[1].Value) | ID: $($id.Groups[1].Value)"
        }
    }
}
