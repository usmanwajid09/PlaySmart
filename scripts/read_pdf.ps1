$bytes = [System.IO.File]::ReadAllBytes('C:\Data\PlaySmart\Heuristic_Evaluation_Workbook_1_Fillable.pdf')
$text = [System.Text.Encoding]::ASCII.GetString($bytes)

# Extract text between parentheses (PDF text objects)
$matches = [regex]::Matches($text, '(?<=\()([^\)]{3,300})(?=\))')
$seen = @{}
foreach($m in $matches) {
    $v = $m.Value.Trim()
    if ($v.Length -gt 2 -and $v -match '[a-zA-Z]{3,}' -and -not $seen.ContainsKey($v)) {
        # Filter out PDF internal commands
        if ($v -notmatch '^(obj|endobj|stream|Tf|Td|Tj|TJ|Tm|Do|re|cm|rg|RG|CS|cs|gs|scn|SCN|dict|Length|Type|Subtype|Pages|Font|BaseFont|Filter|Width|Height|BBox|Matrix|URI|Annot|XObject|Image|DeviceRGB|FlateDecode|Catalog|Outlines|Page|MediaBox|Contents|Resources|ProcSet|PDF|Text|ImageB|ImageC|ImageI|ExtGState|Normal|BM|Widths|FirstChar|LastChar|Encoding|Differences|Helvetica|WinAnsiEncoding|StandardEncoding|MacRomanEncoding)$') {
            Write-Host $v
            $seen[$v] = $true
        }
    }
}
