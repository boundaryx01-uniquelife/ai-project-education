Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Module = Join-Path $Root "portal\modules\level-1-chat-agent"

$RequiredFiles = @(
    "index.html",
    "workshop.html",
    "workshop-v6.css",
    "workshop-v6.js",
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
$Js = Get-Content -LiteralPath (Join-Path $Module "workshop-v6.js") -Raw
$Css = Get-Content -LiteralPath (Join-Path $Module "workshop-v6.css") -Raw
$Data = Get-Content -LiteralPath (Join-Path $Module "data.js") -Raw

$Checks = @(
    @{ Name = "Intro elementary route"; Value = $Intro.Contains('workshop.html?audience=elementary') },
    @{ Name = "Intro secondary route"; Value = $Intro.Contains('workshop.html?audience=secondary') },
    @{ Name = "Intro adult route"; Value = $Intro.Contains('workshop.html?audience=adult') },
    @{ Name = "Intro money product screen"; Value = $Intro.Contains('Pocket Guard') },
    @{ Name = "Intro study product screen"; Value = $Intro.Contains('Focus Plan') },
    @{ Name = "Intro travel product screen"; Value = $Intro.Contains('Bohol') },
    @{ Name = "Workshop v6 CSS"; Value = $Workshop.Contains('href="./workshop-v6.css"') },
    @{ Name = "Workshop v6 JS"; Value = $Workshop.Contains('src="./workshop-v6.js"') },
    @{ Name = "Runnable iframe"; Value = $Js.Contains('sandbox="allow-scripts"') -and $Js.Contains('srcdoc') },
    @{ Name = "Sandbox CSP"; Value = $Js.Contains('Content-Security-Policy') -and $Js.Contains("connect-src 'none'") },
    @{ Name = "HTML artifact state"; Value = $Js.Contains('artifactHtml') },
    @{ Name = "HTML fence stripping"; Value = $Js.Contains('function stripFence') },
    @{ Name = "Runnable HTML gate"; Value = $Js.Contains('function hasRunnableHtml') },
    @{ Name = "Stage one uses runnable MVP gate"; Value = $Js.Contains('if(i===0)return hasRunnableHtml()') },
    @{ Name = "Navigation gate feedback"; Value = $Js.Contains('function gateMessage') },
    @{ Name = "Next button remains clickable"; Value = $Js.Contains('$("#next").disabled=false') },
    @{ Name = "MVP implementation prompt"; Value = $Js.Contains('single HTML') -or $Js.Contains('HTML/CSS/JavaScript') },
    @{ Name = "Code paste box"; Value = $Js.Contains('id="artifactHtml"') },
    @{ Name = "Refinement phase"; Value = $Js.Contains('mustNot') -and $Js.Contains('askAgain') },
    @{ Name = "Validation phase"; Value = $Js.Contains('userResult') -and $Js.Contains('aiResult') },
    @{ Name = "Deployment phase"; Value = $Js.Contains('function architecture') },
    @{ Name = "Four learner stages"; Value = $Js.Contains('${state.stage+1} / 4') },
    @{ Name = "Local storage"; Value = $Js.Contains('localStorage') },
    @{ Name = "No fetch call"; Value = -not $Js.Contains('fetch(') },
    @{ Name = "No external CDN"; Value = -not ($Workshop -match 'https?://') },
    @{ Name = "Two-column layout"; Value = $Css.Contains('.board{display:grid') },
    @{ Name = "Preview frame style"; Value = $Css.Contains('.preview-frame') },
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

Write-Host "PASS: LEVEL 1 executable MVP workshop static validation"
