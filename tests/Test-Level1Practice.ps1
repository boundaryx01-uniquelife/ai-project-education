Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Workshop = Join-Path $Root "portal\workshops\level-1"
$HtmlPath = Join-Path $Workshop "index.html"
$CssPath = Join-Path $Workshop "practice.css"
$JsPath = Join-Path $Workshop "practice.js"
$Failed = @()

@($HtmlPath, $CssPath, $JsPath) | ForEach-Object {
    if (-not (Test-Path -LiteralPath $_ -PathType Leaf)) { $Failed += "Missing Level 1 practice file: $_" }
}

$Html = Get-Content -LiteralPath $HtmlPath -Raw
$Css = Get-Content -LiteralPath $CssPath -Raw
$Js = Get-Content -LiteralPath $JsPath -Raw
$Portal = Get-Content -LiteralPath (Join-Path $Root "portal\index.html") -Raw

$Checks = @(
    @{ Name = "Five guided practice steps"; Value = $Html.Contains('data-step="1"') -and $Html.Contains('data-step="2"') -and $Html.Contains('data-step="3"') -and $Html.Contains('data-step="4"') -and $Html.Contains('data-step="5"') },
    @{ Name = "Three prefilled student examples"; Value = $Js.Contains('study:') -and $Js.Contains('project:') -and $Js.Contains('career:') },
    @{ Name = "Custom idea path"; Value = $Html.Contains('id="useCustom"') -and $Js.Contains('function selectExample') },
    @{ Name = "Copyable AI prompt"; Value = $Html.Contains('data-copy="promptText"') -and $Js.Contains('function copyPrompt') -and $Js.Contains('manifest.webmanifest') },
    @{ Name = "Editable complete PWA files"; Value = $Html.Contains('data-file="index.html"') -and $Html.Contains('data-file="service-worker.js"') -and $Js.Contains('function starterFiles') -and $Js.Contains('function workerFile') },
    @{ Name = "Sandbox preview"; Value = $Html.Contains('sandbox="allow-scripts"') -and $Js.Contains('srcdoc') },
    @{ Name = "Pinpoint refinement defaults to the same AI conversation"; Value = $Html.Contains('id="refinePrompt"') -and $Html.Contains('data-refine="deadline"') -and $Html.Contains('id="includeCurrentCode"') -and $Js.Contains('function refinementPrompt') -and $Js.Contains('includeCurrentCode: false') -and $Js.Contains('새 대화에서 작업하므로 현재 index.html 전체 코드') -and $Js.Contains('Math.min(5') },
    @{ Name = "Functional generated app"; Value = $Js.Contains('localStorage') -and $Js.Contains('목록에 추가') -and $Js.Contains('serviceWorker') },
    @{ Name = "Package download actions"; Value = $Html.Contains('id="downloadIndex"') -and $Html.Contains('id="downloadReadme"') -and $Js.Contains('function download') },
    @{ Name = "Manual runtime test checklist"; Value = $Html.Contains('data-test="input"') -and $Html.Contains('data-test="change"') -and $Html.Contains('data-test="reload"') },
    @{ Name = "Readable code editor surface"; Value = $Css.Contains('.code-editor') -and $Css.Contains('background:#101525') -and $Css.Contains('color:#e5edf8') },
    @{ Name = "Portal exposes practice separately from paper"; Value = $Portal.Contains('./workshops/level-1/') -and $Portal.Contains('./worksheets/level-1.html') },
    @{ Name = "No remote API integration in practice runner"; Value = $Js.Contains('caches.match') -and (-not $Js.Contains('apiKey')) -and (-not $Js.Contains('api.openai')) -and (-not $Js.Contains('https://api.')) }
)

foreach ($Check in $Checks) {
    if ($Check.Value) { Write-Host "PASS: $($Check.Name)" }
    else { Write-Host "FAIL: $($Check.Name)"; $Failed += $Check.Name }
}

if ($Failed.Count) { throw "Level 1 practice validation failed: $($Failed -join ', ')" }
Write-Host "PASS: Level 1 guided practice validation"
