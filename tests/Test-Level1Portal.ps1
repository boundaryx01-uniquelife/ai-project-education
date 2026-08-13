Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Module = Join-Path $Root "portal\modules\level-1-chat-agent"
$RequiredFiles = @("index.html", "workshop.html", "workshop-v6.css", "workshop-v7.css", "workshop-v6.js", "data.js", "README.md")

foreach ($Name in $RequiredFiles) {
    $Path = Join-Path $Module $Name
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) { throw ("Missing required file: " + $Path) }
}

$Intro = Get-Content -LiteralPath (Join-Path $Module "index.html") -Raw
$Workshop = Get-Content -LiteralPath (Join-Path $Module "workshop.html") -Raw
$Js = Get-Content -LiteralPath (Join-Path $Module "workshop-v6.js") -Raw
$Css = Get-Content -LiteralPath (Join-Path $Module "workshop-v7.css") -Raw
$Data = Get-Content -LiteralPath (Join-Path $Module "data.js") -Raw

$Checks = @(
    @{ Name = "Four stages"; Value = $Js.Contains('${state.stage+1} / 4') -and $Js.Contains('1. MVP') -and $Js.Contains('2. ') -and $Js.Contains('3. ') -and $Js.Contains('4. ') },
    @{ Name = "Active CSS reference"; Value = $Workshop.Contains('href="./workshop-v7.css"') -and $Css.Contains('workshop-v6.css') },
    @{ Name = "Active JS reference"; Value = $Workshop.Contains('src="./workshop-v6.js"') },
    @{ Name = "Runnable sandbox iframe"; Value = $Js.Contains('sandbox="allow-scripts"') -and $Js.Contains('srcdoc') },
    @{ Name = "HTML document extraction"; Value = $Js.Contains('function extractHtmlDocument') -and $Js.Contains('code.value=state.artifactHtml') },
    @{ Name = "Network CSP blocked"; Value = $Js.Contains('Content-Security-Policy') -and $Js.Contains("connect-src 'none'") -and $Js.Contains("default-src 'none'") },
    @{ Name = "No portal fetch"; Value = -not $Js.Contains('fetch(') },
    @{ Name = "No external CDN"; Value = -not ($Workshop -match 'https?://') -and -not ($Css -match 'https?://') },
    @{ Name = "Stage 1 runnable gate"; Value = $Js.Contains('hasRunnableHtml()&&Object.values(state.selfCheck).every(Boolean)') },
    @{ Name = "Stage 1 self-check"; Value = $Js.Contains('selfCheck.inputChanges') -and $Js.Contains('selfCheck.ruleBased') -and $Js.Contains('selfCheck.notEcho') },
    @{ Name = "Next remains clickable"; Value = $Js.Contains('$("#next").disabled=false') },
    @{ Name = "Clear gate feedback"; Value = $Js.Contains('function gateMessage') -and $Js.Contains('missing.join') },
    @{ Name = "Stage 2 behavioral record"; Value = $Js.Contains('refine.issue') -and $Js.Contains('refine.change') -and $Js.Contains('constraintConfirmed') },
    @{ Name = "Stage 2 complete HTML prompt"; Value = $Js.Contains('HTML') -and $Js.Contains('stripFence(state.artifactHtml)') -and $Js.Contains('Markdown') },
    @{ Name = "Stage 3 user validation"; Value = $Js.Contains('testSituation') -and $Js.Contains('testOutcome') -and $Js.Contains('feedback') },
    @{ Name = "Stage 3 AI decision"; Value = $Js.Contains('accepted') -and $Js.Contains('rejected') -and $Js.Contains('decisionReason') },
    @{ Name = "Stage 3 AI skip path"; Value = $Js.Contains('skipReason') -and $Js.Contains('substituteEvidence') },
    @{ Name = "Stage 3 in-place validation loop"; Value = $Js.Contains('revisionNeeded') -and $Js.Contains('revisionPlan') -and $Js.Contains('revisionApplied') -and $Js.Contains('retestPassed') -and $Js.Contains('renderValidationForm') },
    @{ Name = "Stage 3 single-column layout"; Value = $Css.Contains('.validation-grid { display:grid; grid-template-columns:1fr;') },
    @{ Name = "Revision and validation history"; Value = $Js.Contains('refinementHistory') -and $Js.Contains('validationHistory') -and $Js.Contains('archiveRefinement') },
    @{ Name = "Stage 4 decisions"; Value = $Js.Contains('browserStorage') -and $Js.Contains('database') -and $Js.Contains('external') -and $Js.Contains('nextFunctions') },
    @{ Name = "Project package export"; Value = $Workshop.Contains('downloadMarkdown') -and $Workshop.Contains('downloadHtml') -and $Js.Contains('function projectMarkdown') },
    @{ Name = "Individual project fields"; Value = $Js.Contains('mvp.name') -and $Js.Contains('mvp.user') -and $Js.Contains('mvp.problem') -and $Js.Contains('mvp.outcome') -and $Js.Contains('mvp.required') -and $Js.Contains('mvp.rules') },
    @{ Name = "Representative examples"; Value = $Data.Contains('elementary:') -and $Data.Contains('secondary:') -and $Data.Contains('adult:') },
    @{ Name = "Free topic path"; Value = $Data.Contains('custom:') -and $Data.Contains('modify:') },
    @{ Name = "Local storage"; Value = $Js.Contains('localStorage') }
)

$Failed = @()
foreach ($Check in $Checks) {
    if ($Check.Value) { Write-Host ("PASS: " + $Check.Name) }
    else { Write-Host ("FAIL: " + $Check.Name); $Failed += $Check.Name }
}
if ($Failed.Count -gt 0) { throw ("Static validation failed: " + ($Failed -join ", ")) }
Write-Host "PASS: LEVEL 1 individualized workshop static validation"
