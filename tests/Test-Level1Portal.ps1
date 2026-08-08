Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Module = Join-Path $Root "portal\modules\level-1-chat-agent"

$RequiredFiles = @(
    "index.html",
    "workshop.html",
    "styles.css",
    "a11y.css",
    "data.js",
    "app.js",
    "ux-v2.js",
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
$Js = Get-Content -LiteralPath (Join-Path $Module "app.js") -Raw
$Ux = Get-Content -LiteralPath (Join-Path $Module "ux-v2.js") -Raw
$Data = Get-Content -LiteralPath (Join-Path $Module "data.js") -Raw

$Checks = @(
    @{ Name = "Intro elementary link"; Value = $Intro.Contains('workshop.html?audience=elementary') },
    @{ Name = "Intro secondary link"; Value = $Intro.Contains('workshop.html?audience=secondary') },
    @{ Name = "Intro adult link"; Value = $Intro.Contains('workshop.html?audience=adult') },
    @{ Name = "Workshop relative CSS"; Value = $Workshop.Contains('href="./styles.css"') },
    @{ Name = "Workshop relative data"; Value = $Workshop.Contains('src="./data.js"') },
    @{ Name = "Workshop relative app"; Value = $Workshop.Contains('src="./app.js"') },
    @{ Name = "Workshop relative UX"; Value = $Workshop.Contains('src="./ux-v2.js"') },
    @{ Name = "Audience profiles"; Value = $Data.Contains("audienceExamples") -and $Data.Contains("elementary") -and $Data.Contains("secondary") -and $Data.Contains("adult") },
    @{ Name = "Query audience handoff"; Value = $Ux.Contains("URLSearchParams") -and $Ux.Contains("queryAudience") },
    @{ Name = "Change example link"; Value = $Ux.Contains("changeExample") -and $Ux.Contains("./index.html") },
    @{ Name = "Local storage"; Value = $Js.Contains("localStorage") },
    @{ Name = "Context packet"; Value = $Js.Contains("function packet") },
    @{ Name = "State snapshot"; Value = $Js.Contains("function snapshot") },
    @{ Name = "Markdown export"; Value = $Js.Contains("function markdown") },
    @{ Name = "Three test types"; Value = $Js.Contains('"normal","boundary","failure"') },
    @{ Name = "No fetch calls"; Value = -not $Js.Contains("fetch(") },
    @{ Name = "No external CDN in workshop"; Value = -not ($Workshop -match 'https?://') },
    @{ Name = "Data version"; Value = $Data.Contains('version:"1.1.0"') }
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

Write-Host "PASS: LEVEL 1 split intro/workshop validation"
