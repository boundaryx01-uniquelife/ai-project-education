Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Module = Join-Path $Root "portal\modules\level-1-chat-agent"

$RequiredFiles = @(
    "index.html",
    "styles.css",
    "data.js",
    "app.js",
    "README.md"
)

foreach ($Name in $RequiredFiles) {
    $Path = Join-Path $Module $Name
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw ("Missing required file: " + $Path)
    }
}

$Html = Get-Content -LiteralPath (Join-Path $Module "index.html") -Raw
$Js = Get-Content -LiteralPath (Join-Path $Module "app.js") -Raw
$Data = Get-Content -LiteralPath (Join-Path $Module "data.js") -Raw

$Checks = @(
    @{ Name = "Relative CSS path"; Value = $Html.Contains('href="./styles.css"') },
    @{ Name = "Relative data path"; Value = $Html.Contains('src="./data.js"') },
    @{ Name = "Relative app path"; Value = $Html.Contains('src="./app.js"') },
    @{ Name = "Local storage"; Value = $Js.Contains("localStorage") },
    @{ Name = "Context packet"; Value = $Js.Contains("function packet") },
    @{ Name = "State snapshot"; Value = $Js.Contains("function snapshot") },
    @{ Name = "Markdown export"; Value = $Js.Contains("function markdown") },
    @{ Name = "Three test types"; Value = $Js.Contains('"normal","boundary","failure"') },
    @{ Name = "No fetch calls"; Value = -not $Js.Contains("fetch(") },
    @{ Name = "No external CDN"; Value = -not ($Html -match 'https?://') },
    @{ Name = "Data version"; Value = $Data.Contains('version:"1.0.0"') }
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

Write-Host "PASS: LEVEL 1 portal static validation"
