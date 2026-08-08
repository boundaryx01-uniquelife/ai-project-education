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
    @{ Name = "Workshop v3 CSS"; Value = $Workshop.Contains('href="./workshop-v3.css"') },
    @{ Name = "Workshop data"; Value = $Workshop.Contains('src="./data.js"') },
    @{ Name = "Workshop v3 JS"; Value = $Workshop.Contains('src="./workshop-v3.js"') },
    @{ Name = "Sample panel"; Value = $Workshop.Contains('id="sampleStage"') },
    @{ Name = "Follow panel"; Value = $Workshop.Contains('id="webForm"') },
    @{ Name = "Web task block"; Value = $Workshop.Contains('task-web') },
    @{ Name = "AI task block"; Value = $Workshop.Contains('task-ai') },
    @{ Name = "Final checkpoint"; Value = $Workshop.Contains('id="finishState"') },
    @{ Name = "Interactive demo"; Value = $Js.Contains('function renderDemo') },
    @{ Name = "Six learner stages"; Value = $Js.Contains('name:"6.') },
    @{ Name = "Agent output"; Value = $Js.Contains('function agentText') },
    @{ Name = "AI copy prompt"; Value = $Js.Contains('function aiPrompt') },
    @{ Name = "Final package"; Value = $Js.Contains('function finalPackage') },
    @{ Name = "Local storage"; Value = $Js.Contains('localStorage') },
    @{ Name = "No fetch call"; Value = -not $Js.Contains('fetch(') },
    @{ Name = "No external CDN"; Value = -not ($Workshop -match 'https?://') },
    @{ Name = "Two-column layout"; Value = $Css.Contains('.board{display:grid') },
    @{ Name = "Elementary example"; Value = $Data.Contains('name:"') -and $Data.Contains('elementary:') },
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

Write-Host "PASS: LEVEL 1 intro and simplified workshop static validation"
