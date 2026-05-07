$content = Get-Content 'C:\Users\shani\.gemini\antigravity\brain\193b7e06-e98e-4e62-91e7-86eada651b0a\.system_generated\steps\144\output.txt' -Raw
$matches = [regex]::Matches($content, '"title":"([^"]+)"')
$i = 1
foreach($m in $matches) {
    Write-Host "$i. $($m.Groups[1].Value)"
    $i++
}
