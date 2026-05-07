$content = Get-Content 'C:\Data\PlaySmart\rubric_extracted\word\document.xml' -Raw
$matches = [regex]::Matches($content, '(?<=<w:t[^>]*>)([^<]+)(?=</w:t>)')
foreach($m in $matches) {
    Write-Host $m.Value
}
