Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Module = Join-Path $Root "portal\modules\level-1-chat-agent"

$RequiredFiles = @(
    "index.html",
    "workshop.html",
    "workshop-v5.css",
    "workshop-v5.js",
    "data.js",
    "README.md"
)

foreach ($Name in $RequiredFiles) {
    $Path = Join-Path $Module $Name
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw ("Missing required file: " + $Path)
    }
}

$Intro = Get-Content -LiteralPath (Join-Path $Module "index.html") -Raw
$Workshop = Get-Content -LiteralPath (Join-Path $Module "workshop.html") -Raw
$Js = Get-Content -LiteralPath (Join-Path $Module "workshop-v5.js") -Raw
$Css = Get-Content -LiteralPath (Join-Path $Module "workshop-v5.css") -Raw
$Data = Get-Content -LiteralPath (Join-Path $Module "data.js") -Raw

$Checks = @(
    @{ Name = "Intro elementary route"; Value = $Intro.Contains('workshop.html?audience=elementary') },
    @{ Name = "Intro secondary route"; Value = $Intro.Contains('workshop.html?audience=secondary') },
    @{ Name = "Intro adult route"; Value = $Intro.Contains('workshop.html?audience=adult') },
    @{ Name = "Intro money product screen"; Value = $Intro.Contains('Pocket Guard') },
    @{ Name = "Intro study product screen"; Value = $Intro.Contains('Focus Plan') },
    @{ Name = "Intro travel product screen"; Value = $Intro.Contains('Bohol') },
    @{ Name = "Workshop v5 CSS"; Value = $Workshop.Contains('href="./workshop-v5.css"') },
    @{ Name = "Workshop v5 JS"; Value = $Workshop.Contains('src="./workshop-v5.js"') },
    @{ Name = "Live panel"; Value = $Workshop.Contains('id="liveBody"') -and $Workshop.Contains('MY AGENT') },
    @{ Name = "Follow panel"; Value = $Workshop.Contains('id="webForm"') },
    @{ Name = "Web activity block"; Value = $Workshop.Contains('task-web') },
    @{ Name = "AI activity block"; Value = $Workshop.Contains('task-ai') },
    @{ Name = "MVP phase"; Value = $Js.Contains('name:"1. MVP') },
    @{ Name = "Refine phase"; Value = $Js.Contains('mustNot') -and $Js.Contains('askAgain') },
    @{ Name = "Validation phase"; Value = $Js.Contains('userResult') -and $Js.Contains('aiResult') },
    @{ Name = "Deployment phase"; Value = $Js.Contains('function arch') },
    @{ Name = "Four learner stages"; Value = $Js.Contains('${state.stage+1} / 4') },
    @{ Name = "Live preview renderer"; Value = $Js.Contains('function renderLive') },
    @{ Name = "Follow input updates live"; Value = $Js.Contains('renderLive();renderProgress()') },
    @{ Name = "Agent instruction"; Value = $Js.Contains('function baseAgent') },
    @{ Name = "AI prompt"; Value = $Js.Contains('function prompt') },
    @{ Name = "Local storage"; Value = $Js.Contains('localStorage') },
    @{ Name = "No fetch call"; Value = -not $Js.Contains('fetch(') },
    @{ Name = "No external CDN"; Value = -not ($Workshop -match 'https?://') },
    @{ Name = "Two-column layout"; Value = $Css.Contains('.board{display:grid') },
    @{ Name = "Live product styles"; Value = $Css.Contains('.product-name') -and $Css.Contains('.result-shell') },
    @{ Name = "Elementary example data"; Value = $Data.Contains('elementary:') },
    @{ Name = "Secondary example data"; Value = $Data.Contains('secondary:') },
    @{ Name = "Adult example data"; Value = $Data.Contains('adult:') }
)

$Failed = @()
foreach ($Check in $Checks) {
    if ($Check.Value) {
        Write-Host ("PASS: " + $Check.Name)
    }
    else {
        Write-Host ("FAIL: " + $Check.Name)
        $Failed += $Check.Name
    }
}

if ($Failed.Count -gt 0) {
    throw ("Static validation failed: " + ($Failed -join ", "))
}

Write-Host "PASS: LEVEL 1 live-linked four-phase workshop static validation"
