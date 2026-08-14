Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Module = Join-Path $Root "portal\modules\level-2-deploy-web-agent"
$Files = @("index.html", "level2.css", "level2.js", "README.md")
foreach ($Name in $Files) {
    if (-not (Test-Path -LiteralPath (Join-Path $Module $Name) -PathType Leaf)) { throw ("Missing LEVEL 2 file: " + $Name) }
}
$Html = Get-Content -LiteralPath (Join-Path $Module "index.html") -Raw
$Js = Get-Content -LiteralPath (Join-Path $Module "level2.js") -Raw
$Checks = @(
    @{ Name = "Independent project brief"; Value = $Html.Contains('projectName') -and $Html.Contains('userFlow') -and -not $Html.Contains('handoffText') },
    @{ Name = "Screen and result design"; Value = $Html.Contains('screenDefinition') -and $Js.Contains('screenDefinition') },
    @{ Name = "Level 2 context packet"; Value = $Js.Contains('PROJECT CONTEXT PACKET') -and $Js.Contains('STOP CONDITION') },
    @{ Name = "Deployment validation"; Value = $Js.Contains('pages:false') -and $Html.Contains('data-check="pages"') },
    @{ Name = "Local storage"; Value = $Js.Contains('localStorage') },
    @{ Name = "No network integration"; Value = -not $Js.Contains('fetch(') },
    @{ Name = "No Level 1 dependency"; Value = -not $Js.Contains('handoff') -and -not $Js.Contains('LEVEL 1 인계') },
    @{ Name = "Level 2 visual identity"; Value = (Get-Content -LiteralPath (Join-Path $Module "level2.css") -Raw).Contains('#4356b8') }
)
$Failed = @()
foreach ($Check in $Checks) { if ($Check.Value) { Write-Host ("PASS: " + $Check.Name) } else { Write-Host ("FAIL: " + $Check.Name); $Failed += $Check.Name } }
if ($Failed.Count -gt 0) { throw ("LEVEL 2 static validation failed: " + ($Failed -join ", ")) }
Write-Host "PASS: LEVEL 2 foundation static validation"
