Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Foundation = Join-Path $Root "portal\foundation"
$Lesson = Join-Path $Root "curriculum\shared\AI_PROJECT_FOUNDATION_LESSON_01_20260823.md"

$Html = Get-Content -LiteralPath (Join-Path $Foundation "index.html") -Raw
$Css = Get-Content -LiteralPath (Join-Path $Foundation "foundation.css") -Raw
$Js = Get-Content -LiteralPath (Join-Path $Foundation "foundation.js") -Raw
$Portal = Get-Content -LiteralPath (Join-Path $Root "portal\index.html") -Raw
$LessonText = Get-Content -LiteralPath $Lesson -Raw
$Failed = @()

@("index.html", "foundation.css", "foundation.js") | ForEach-Object {
    if (-not (Test-Path -LiteralPath (Join-Path $Foundation $_) -PathType Leaf)) { $Failed += "Missing foundation portal file: $_" }
}
if (-not (Test-Path -LiteralPath $Lesson -PathType Leaf)) { $Failed += "Missing foundation lesson source" }

$Checks = @(
    @{ Name = "Portal begins with foundation route"; Value = $Portal.Contains("./foundation/") },
    @{ Name = "Deployed lesson source link exists"; Value = $Html -match 'github\.com/boundaryx01-uniquelife/ai-project-education/blob/feature/stage-03-level-1-portal/curriculum/shared/AI_PROJECT_FOUNDATION_LESSON_01_20260823\.md' },
    @{ Name = "Portal source links avoid non-deployed files"; Value = -not ($Html -match '\.\./\.\./curriculum/') },
    @{ Name = "Foundation includes 20 and 40 minute lesson paths"; Value = $Html.Contains("20~40") -and $LessonText.Contains("20") -and $LessonText.Contains("40") },
    @{ Name = "AI capability progression is present"; Value = $Html.Contains("AI Workflow") -and $Html.Contains("AI Agent") -and $Html.Contains("Agentic AI") },
    @{ Name = "Chatbot and Agent comparison is present"; Value = $Html.Contains("CHATBOT") -and $Html.Contains("AGENT") },
    @{ Name = "MVP Agent PWA are distinct"; Value = $Html.Contains('<small>MVP</small>') -and $Html.Contains('<small>AGENT</small>') -and $Html.Contains('<small>PWA</small>') },
    @{ Name = "Prompt and safe-use instruction is present"; Value = $Html.Contains("prompt-shape") -and $Html.Contains("SAFE START") },
    @{ Name = "Interactive case sorting is present"; Value = $Js.Contains("CASES") -and $Js.Contains("quiz-feedback") -and $Js.Contains("Agentic AI") },
    @{ Name = "Exit ticket can be copied"; Value = $Html.Contains("data-ticket") -and $Js.Contains("copyTicket") },
    @{ Name = "Foundation visual is responsive"; Value = $Css.Contains("@media(max-width:760px)") -and $Css.Contains(".hero") },
    @{ Name = "Advanced out-of-scope terms are excluded"; Value = -not ($LessonText -match "Vector DB|\bRAG\b|\bMCP\b") }
)

foreach ($Check in $Checks) {
    if ($Check.Value) { Write-Host "PASS: $($Check.Name)" }
    else { Write-Host "FAIL: $($Check.Name)"; $Failed += $Check.Name }
}
if ($Failed.Count) { throw "Foundation lesson validation failed: $($Failed -join ', ')" }
Write-Host "PASS: Foundation lesson validation"
