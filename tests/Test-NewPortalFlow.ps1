Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Portal = Get-Content -LiteralPath (Join-Path $Root "portal\index.html") -Raw
$Css = Get-Content -LiteralPath (Join-Path $Root "portal\assets\styles.css") -Raw
$Legacy = Get-Content -LiteralPath (Join-Path $Root "portal\legacy\index.html") -Raw
$Flow = Get-Content -LiteralPath (Join-Path $Root "docs\02_curriculum_design\LEVEL_1_TO_4_WORKSHOP_FLOW_20260821.md") -Raw
$Launcher = Get-Content -LiteralPath (Join-Path $Root "portal\Start-Portal.cmd") -Raw

$Checks = @(
    @{ Name = "New portal identifies Busan context"; Value = $Portal.Contains("BUSAN") -and $Portal.Contains("BUSAN DATA AGENT") },
    @{ Name = "Four independent levels have clear outputs"; Value = $Portal.Contains("VIBE CODING START") -and $Portal.Contains("WORKFLOW AGENT") -and $Portal.Contains("BUSAN DATA AGENT") -and $Portal.Contains("AI MODEL AGENT") },
    @{ Name = "Level 1 provides three student-life examples"; Value = $Portal.Contains("PWA") -and $Portal.Contains('data-example-count="3"') },
    @{ Name = "Two-window practice is visible"; Value = $Portal.Contains("TWO-WINDOW PRACTICE") -and $Portal.Contains("practice-flow") },
    @{ Name = "Old prototypes are archived from primary path"; Value = $Portal.Contains("./legacy/") -and $Legacy.Contains("ARCHIVE") -and $Legacy.Contains("modules/level-1-chat-agent") },
    @{ Name = "Local launcher opens the new portal"; Value = $Launcher.Contains('http://127.0.0.1:8080/') -and (-not $Launcher.Contains('modules/level-1-chat-agent')) },
    @{ Name = "Design uses mobile-first editorial surface"; Value = $Css.Contains(".hero-art") -and $Css.Contains(".phone") -and $Css.Contains(".level-row") -and $Css.Contains("@media(max-width:760px)") },
    @{ Name = "Curriculum document defines secure Busan API use"; Value = $Flow.Contains("LEVEL 3") -and $Flow.Contains("API") -and $Flow.Contains("GitHub Pages") },
    @{ Name = "Telegram remains guide-only"; Value = $Flow.Contains("TELEGRAM_GUIDE_ONLY") -and $Flow.Contains("Level 4") }
)

$Failed = @()
foreach ($Check in $Checks) {
    if ($Check.Value) { Write-Host "PASS: $($Check.Name)" }
    else { Write-Host "FAIL: $($Check.Name)"; $Failed += $Check.Name }
}
if ($Failed.Count) { throw "New portal flow validation failed: $($Failed -join ', ')" }
Write-Host "PASS: New portal flow validation"
