Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Module = Join-Path $Root "portal\modules\level-1-chat-agent"

$RequiredFiles = @(
    "index.html",
    "workshop.html",
    "workshop-v3.css",
    "workshop-v3.js",
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
$Js = Get-Content -LiteralPath (Join-Path $Module "workshop-v3.js") -Raw
$Css = Get-Content -LiteralPath (Join-Path $Module "workshop-v3.css") -Raw
$Data = Get-Content -LiteralPath (Join-Path $Module "data.js") -Raw

$Checks = @(
    @{ Name = "Intro elementary route"; Value = $Intro.Contains('workshop.html?audience=elementary') },
    @{ Name = "Intro secondary route"; Value = $Intro.Contains('workshop.html?audience=secondary') },
    @{ Name = "Intro adult route"; Value = $Intro.Contains('workshop.html?audience=adult') },
    @{ Name = "Workshop CSS"; Value = $Workshop.Contains('href="./workshop-v3.css"') },
    @{ Name = "Workshop data"; Value = $Workshop.Contains('src="./data.js"') },
    @{ Name = "Workshop JS"; Value = $Workshop.Contains('src="./workshop-v3.js"') },
    @{ Name = "Sample panel"; Value = $Workshop.Contains('id="sampleStage"') },
    @{ Name = "Follow panel"; Value = $Workshop.Contains('id="webForm"') },
    @{ Name = "Web activity block"; Value = $Workshop.Contains('task-web') },
    @{ Name = "AI activity block"; Value = $Workshop.Contains('task-ai') },
    @{ Name = "Interactive product preview"; Value = $Workshop.Contains('product-shell') -and $Js.Contains('function renderDemo') },
    @{ Name = "MVP phase"; Value = $Js.Contains('name:"1. MVP') },
    @{ Name = "Refine phase"; Value = $Js.Contains('name:"2.') -and $Js.Contains('mustNot') },
    @{ Name = "Validation phase"; Value = $Js.Contains('name:"3.') -and $Js.Contains('userResult') -and $Js.Contains('aiResult') },
    @{ Name = "Deployment decision phase"; Value = $Js.Contains('name:"4.') -and $Js.Contains('function architecture') },
    @{ Name = "Four learner stages"; Value = $Js.Contains('${state.stage+1} / 4') },
    @{ Name = "Agent instruction"; Value = $Js.Contains('function baseAgent') },
    @{ Name = "AI prompt"; Value = $Js.Contains('function stagePrompt') },
    @{ Name = "Local storage"; Value = $Js.Contains('localStorage') },
    @{ Name = "No fetch call"; Value = -not $Js.Contains('fetch(') },
    @{ Name = "No external CDN"; Value = -not ($Workshop -match 'https?://') },
    @{ Name = "Two-column layout"; Value = $Css.Contains('.board{display:grid') },
    @{ Name = "Product preview style"; Value = $Css.Contains('.product-shell') -and $Css.Contains('.demo-card') },
    @{ Name = "Elementary example"; Value = $Data.Contains('elementary:') },
    @{ Name = "Secondary example"; Value = $Data.Contains('secondary:') },
    @{ Name = "Adult example"; Value = $Data.Contains('adult:') }
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

Write-Host "PASS: LEVEL 1 four-phase workshop static validation"
