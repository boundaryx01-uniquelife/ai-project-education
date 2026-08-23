Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Portal = Get-Content -LiteralPath (Join-Path $Root "portal\index.html") -Raw
$SharedCss = Get-Content -LiteralPath (Join-Path $Root "portal\workshops\shared\agent-practice.css") -Raw
$ExperimentCss = Get-Content -LiteralPath (Join-Path $Root "portal\workshops\shared\change-experiment.css") -Raw
$ExperimentJs = Get-Content -LiteralPath (Join-Path $Root "portal\workshops\shared\change-experiment.js") -Raw
$Failed = @()

foreach ($Level in 2..4) {
    $Folder = Join-Path $Root "portal\workshops\level-$Level"
    $HtmlPath = Join-Path $Folder "index.html"
    $JsPath = Join-Path $Folder "practice.js"
    if (-not (Test-Path -LiteralPath $HtmlPath -PathType Leaf) -or -not (Test-Path -LiteralPath $JsPath -PathType Leaf)) { $Failed += "Missing Level $Level practice files"; continue }
    $Html = Get-Content -LiteralPath $HtmlPath -Raw
    $Js = Get-Content -LiteralPath $JsPath -Raw
    if (-not ($Html.Contains('data-stage="1"') -and $Html.Contains('data-stage="4"'))) { $Failed += "Level $Level has four guided stages" }
    if (-not ($Html.Contains('id="copyPrompt"') -and $Js.Contains('navigator.clipboard'))) { $Failed += "Level $Level has copyable external AI prompt" }
    if (-not ($Js.Contains('localStorage') -and $Html.Contains('data-test='))) { $Failed += "Level $Level keeps learner progress locally" }
    if (-not $Portal.Contains("./workshops/level-$Level/")) { $Failed += "Portal links to Level $Level practice" }
}

$Level2Js = Get-Content -LiteralPath (Join-Path $Root "portal\workshops\level-2\practice.js") -Raw
$Level3Html = Get-Content -LiteralPath (Join-Path $Root "portal\workshops\level-3\index.html") -Raw
$Level3Js = Get-Content -LiteralPath (Join-Path $Root "portal\workshops\level-3\practice.js") -Raw
$Level4Html = Get-Content -LiteralPath (Join-Path $Root "portal\workshops\level-4\index.html") -Raw
$Level4Js = Get-Content -LiteralPath (Join-Path $Root "portal\workshops\level-4\practice.js") -Raw
$Checks = @(
    @{ Name = "Level 2 separates pasted AI response from learner plan"; Value = $Level2Js.Contains('aiResponse') -and $Level2Js.Contains('makePlan') },
    @{ Name = "Level 3 supports learner direct API requests"; Value = $Level3Html.Contains('id="apiKey"') -and $Level3Js.Contains('buildRequestUrl') -and $Level3Js.Contains('fetch(') -and -not $Level3Js.Contains('proxyUrl') },
    @{ Name = "Level 3 never persists the learner API key"; Value = -not $Level3Js.Contains('state.apiKey') -and -not $Level3Js.Contains('apiKey:') -and $Level3Html.Contains('저장되지 않음') },
    @{ Name = "Level 3 links automatic-approval API candidates"; Value = $Level3Html.Contains('15034041') -and $Level3Html.Contains('15145474') -and $Level3Html.Contains('15121074') },
    @{ Name = "Level 4 uses server endpoint without secret in browser"; Value = $Level4Js.Contains('serviceUrl') -and $Level4Js.Contains('fetch(') -and -not $Level4Js.Contains('apiKey') },
    @{ Name = "Shared practice surface prevents Korean word breaks"; Value = $SharedCss.Contains('word-break:keep-all') }
    @{ Name = "Level 2-4 include one small change experiment before final test"; Value = $ExperimentCss.Contains('.experiment-grid') -and $ExperimentJs.Contains('먼저 이 변경이 현재 MVP에서 가능한지') -and $ExperimentJs.Contains('Math.min(5') -and $Level3Html.Contains('change-experiment.js') -and $Level4Html.Contains('change-experiment.js') }
)
foreach ($Check in $Checks) { if ($Check.Value) { Write-Host "PASS: $($Check.Name)" } else { Write-Host "FAIL: $($Check.Name)"; $Failed += $Check.Name } }
if ($Failed.Count) { throw "Level 2-4 practice validation failed: $($Failed -join ', ')" }
Write-Host "PASS: Level 2-4 guided practice validation"
