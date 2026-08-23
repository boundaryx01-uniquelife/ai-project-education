Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Presentation = Join-Path $Root "portal\foundation\presentation"
$Html = Get-Content -LiteralPath (Join-Path $Presentation "index.html") -Raw
$Css = Get-Content -LiteralPath (Join-Path $Presentation "presentation.css") -Raw
$Js = Get-Content -LiteralPath (Join-Path $Presentation "presentation.js") -Raw
$Foundation = Get-Content -LiteralPath (Join-Path $Root "portal\foundation\index.html") -Raw
$Failed = @()

@("index.html", "presentation.css", "presentation.js") | ForEach-Object {
    if (-not (Test-Path -LiteralPath (Join-Path $Presentation $_) -PathType Leaf)) { $Failed += "Missing presentation file: $_" }
}

$Checks = @(
    @{ Name = "Foundation links to presentation mode"; Value = $Foundation.Contains("./presentation/") },
    @{ Name = "Presentation has ten slides"; Value = ([regex]::Matches($Html, 'data-slide')).Count -eq 10 },
    @{ Name = "Presentation includes core capability sequence"; Value = $Html.Contains("AI Workflow") -and $Html.Contains("AI Agent") -and $Html.Contains("Agentic AI") },
    @{ Name = "Presentation includes safe AI use"; Value = $Html.Contains("개인정보") -and $Html.Contains("출처") -and $Html.Contains("판단") },
    @{ Name = "Presentation includes project vocabulary"; Value = $Html.Contains("MVP") -and $Html.Contains("PWA") -and $Html.Contains("AGENT") },
    @{ Name = "Presentation supports previous and next controls"; Value = $Js.Contains('"#previous"') -and $Js.Contains('"#next"') -and $Js.Contains("render") },
    @{ Name = "Presentation supports keyboard and fullscreen"; Value = $Js.Contains("ArrowRight") -and $Js.Contains("requestFullscreen") },
    @{ Name = "Presentation is responsive"; Value = $Css.Contains("@media(max-width:700px)") }
)

foreach ($Check in $Checks) {
    if ($Check.Value) { Write-Host "PASS: $($Check.Name)" }
    else { Write-Host "FAIL: $($Check.Name)"; $Failed += $Check.Name }
}
if ($Failed.Count) { throw "Foundation presentation validation failed: $($Failed -join ', ')" }
Write-Host "PASS: Foundation presentation validation"
