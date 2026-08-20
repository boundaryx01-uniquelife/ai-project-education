Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Worksheets = Join-Path $Root "portal\worksheets"
$Files = @("index.html", "level-1.html", "level-2.html", "level-3.html", "level-4.html", "worksheets.css", "worksheets.js")
$Failed = @()

foreach ($File in $Files) {
    if (-not (Test-Path -LiteralPath (Join-Path $Worksheets $File) -PathType Leaf)) {
        $Failed += "Missing worksheet file: $File"
    }
}

$Index = Get-Content -LiteralPath (Join-Path $Worksheets "index.html") -Raw
$Level1 = Get-Content -LiteralPath (Join-Path $Worksheets "level-1.html") -Raw
$Level2 = Get-Content -LiteralPath (Join-Path $Worksheets "level-2.html") -Raw
$Level3 = Get-Content -LiteralPath (Join-Path $Worksheets "level-3.html") -Raw
$Level4 = Get-Content -LiteralPath (Join-Path $Worksheets "level-4.html") -Raw
$Portal = Get-Content -LiteralPath (Join-Path $Root "portal\index.html") -Raw
$Js = Get-Content -LiteralPath (Join-Path $Worksheets "worksheets.js") -Raw

$Checks = @(
    @{ Name = "Four independent learner worksheets"; Value = $Index.Contains("level-1.html") -and $Index.Contains("level-2.html") -and $Index.Contains("level-3.html") -and $Index.Contains("level-4.html") },
    @{ Name = "Portal links to worksheets"; Value = $Portal.Contains("worksheets/") },
    @{ Name = "Level 1 records source and tests"; Value = $Level1.Contains('data-field="l1-source-note"') -and $Level1.Contains('data-field="l1-test"') },
    @{ Name = "Level 2 includes deployment record"; Value = $Level2.Contains('data-field="l2-url"') -and $Level2.Contains("GitHub Pages") },
    @{ Name = "Level 3 includes API safety and FAQ"; Value = $Level3.Contains("l3-api-endpoint") -and $Level3.Contains("faq-grid") -and $Level3.Contains("api-flow") },
    @{ Name = "Level 4 includes operations and recovery"; Value = $Level4.Contains("l4-recover") -and $Level4.Contains("Release") -and $Level4.Contains('data-field="l4-change"') },
    @{ Name = "Worksheet local browser storage"; Value = $Js.Contains("localStorage") -and $Js.Contains("data-field") },
    @{ Name = "Worksheet print support"; Value = $Js.Contains("window.print") }
)

foreach ($Check in $Checks) {
    if ($Check.Value) { Write-Host "PASS: $($Check.Name)" }
    else { Write-Host "FAIL: $($Check.Name)"; $Failed += $Check.Name }
}

if ($Failed.Count) { throw "Learner worksheet validation failed: $($Failed -join ', ')" }
Write-Host "PASS: Learner worksheet validation"
