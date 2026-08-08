Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Module = Join-Path $Root "portal\modules\level-1-chat-agent"

$RequiredFiles = @(
    "index.html",
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

$Html = Get-Content -LiteralPath (Join-Path $Module "index.html") -Raw
$Js = Get-Content -LiteralPath (Join-Path $Module "app.js") -Raw
$Ux = Get-Content -LiteralPath (Join-Path $Module "ux-v2.js") -Raw
$Data = Get-Content -LiteralPath (Join-Path $Module "data.js") -Raw

$Checks = @(
    @{ Name = "Relative CSS path"; Value = $Html.Contains('href="./styles.css"') },
    @{ Name = "Relative data path"; Value = $Html.Contains('src="./data.js"') },
    @{ Name = "Relative app path"; Value = $Html.Contains('src="./app.js"') },
    @{ Name = "Relative UX path"; Value = $Html.Contains('src="./ux-v2.js"') },
    @{ Name = "Result preview first"; Value = $Html.Contains("완성 예시") },
    @{ Name = "Goal starter"; Value = $Html.Contains("내가 만들 에이전트의 목표") },
    @{ Name = "AI exchange flow"; Value = $Html.Contains("AI와 주고받는 실제 활동") },
    @{ Name = "Highlighted completion"; Value = $Html.Contains("마지막으로 여기만 확인") },
    @{ Name = "Friendly stage labels"; Value = $Ux.Contains("목표 정하기") -and $Ux.Contains("AI로 시험하기") },
    @{ Name = "Local storage"; Value = $Js.Contains("localStorage") },
    @{ Name = "Context packet"; Value = $Js.Contains("function packet") },
    @{ Name = "State snapshot"; Value = $Js.Contains("function snapshot") },
    @{ Name = "Markdown export"; Value = $Js.Contains("function markdown") },
    @{ Name = "Three test types"; Value = $Js.Contains('"normal","boundary","failure"') },
    @{ Name = "No fetch calls"; Value = -not $Js.Contains("fetch(") },
    @{ Name = "No external CDN"; Value = -not ($Html -match 'https?://') },
    @{ Name = "Data version"; Value = $Data.Contains('version:"1.1.0"') },
    @{ Name = "Elementary example"; Value = $Data.Contains('name:"용돈지킴이"') },
    @{ Name = "Secondary example"; Value = $Data.Contains('name:"시험기간 플래너"') },
    @{ Name = "Adult example"; Value = $Data.Contains('name:"여행 일정 에이전트"') },
    @{ Name = "Audience selector"; Value = $Html.Contains('data-audience="elementary"') -and $Html.Contains('data-audience="secondary"') -and $Html.Contains('data-audience="adult"') },
    @{ Name = "Audience switch logic"; Value = $Ux.Contains("function renderAudience") }
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
