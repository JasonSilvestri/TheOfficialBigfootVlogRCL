Param(
  [Parameter(Mandatory=$true)][string]$Root
)

Write-Host "Normalizing EOL to CRLF in $Root"
Get-ChildItem -Path $Root -Recurse -File -Include *.md,*.json |
ForEach-Object {
  $text = Get-Content $_.FullName -Raw
  $text = $text -replace "`r?`n", "`r`n"
  [System.IO.File]::WriteAllText($_.FullName, $text, New-Object System.Text.UTF8Encoding($false))
  Write-Host "Normalized: $($_.FullName)"
}
