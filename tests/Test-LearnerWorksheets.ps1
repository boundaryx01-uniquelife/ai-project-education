Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Worksheets = Join-Path $Root "portal\worksheets"
$Files = @("index.html", "level-1.html", "level-2.html", "level-3.html", "level-4.html", "worksheets.css")
$Failed = @()

foreach ($File in $Files) {
    if (-not (Test-Path -LiteralPath (Join-Path $Worksheets $File) -PathType Leaf)) {
        $Failed += "Missing project paper file: $File"
    }
}

$Index = Get-Content -LiteralPath (Join-Path $Worksheets "index.html") -Raw
$Level1 = Get-Content -LiteralPath (Join-Path $Worksheets "level-1.html") -Raw
$Level2 = Get-Content -LiteralPath (Join-Path $Worksheets "level-2.html") -Raw
$Level3 = Get-Content -LiteralPath (Join-Path $Worksheets "level-3.html") -Raw
$Level4 = Get-Content -LiteralPath (Join-Path $Worksheets "level-4.html") -Raw
$Css = Get-Content -LiteralPath (Join-Path $Worksheets "worksheets.css") -Raw

$Checks = @(
    @{ Name = "Project papers are separate from portal"; Value = $Index.Contains("PROJECT PAPERS") -and $Index.Contains("level-1.html") -and $Index.Contains("level-4.html") },
    @{ Name = "Papers are reference material not input forms"; Value = (-not ($Level1 + $Level2 + $Level3 + $Level4 -match "<textarea|<input")) -and (-not $Index.Contains("worksheets.js")) },
    @{ Name = "Each level provides prompt, MVP and FAQ"; Value = @($Level1, $Level2, $Level3, $Level4 | Where-Object { $_.Contains('class="prompt"') -and $_.Contains('id="mvp"') -and $_.Contains('id="faq"') }).Count -eq 4 },
    @{ Name = "Level 1 provides three PWA examples"; Value = $Level1.Contains("EXAMPLE 01") -and $Level1.Contains("EXAMPLE 02") -and $Level1.Contains("EXAMPLE 03") -and $Level1.Contains("manifest.webmanifest") },
    @{ Name = "Level 2 explains human and AI roles"; Value = $Level2.Contains("WORKFLOW AGENT") -and $Level2.Contains("AI API") },
    @{ Name = "Level 3 includes Busan API safety"; Value = $Level3.Contains("BUSAN DATA AGENT") -and $Level3.Contains("GitHub Pages") -and $Level3.Contains("SECRET_KEY_MUST_NOT_BE_CLIENT_SIDE") },
    @{ Name = "Level 4 includes model API safety"; Value = $Level4.Contains("AI MODEL AGENT") -and $Level4.Contains("API") -and $Level4.Contains("MODEL_API_REQUIRES_SERVER_SIDE_SECRET") },
    @{ Name = "Code surfaces have readable contrast"; Value = $Css.Contains(".prompt") -and $Css.Contains("background:#161b30") -and $Css.Contains("color:#e9edf8") },
    @{ Name = "No duplicated legacy API guide remains"; Value = -not (Test-Path -LiteralPath (Join-Path $Worksheets "level-3-api-guide.html")) }
)

foreach ($Check in $Checks) {
    if ($Check.Value) { Write-Host "PASS: $($Check.Name)" }
    else { Write-Host "FAIL: $($Check.Name)"; $Failed += $Check.Name }
}

if ($Failed.Count) { throw "Project paper validation failed: $($Failed -join ', ')" }
Write-Host "PASS: Project paper validation"
