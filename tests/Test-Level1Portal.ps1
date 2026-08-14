Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Module = Join-Path $Root "portal\modules\level-1-chat-agent"
@("index.html", "level1.css", "level1.js", "README.md") | ForEach-Object { if (-not (Test-Path -LiteralPath (Join-Path $Module $_) -PathType Leaf)) { throw "Missing LEVEL 1 file: $_" } }
$Html = Get-Content -LiteralPath (Join-Path $Module "index.html") -Raw
$Js = Get-Content -LiteralPath (Join-Path $Module "level1.js") -Raw
$Checks = @(
 @{Name="Three-session guided practice";Value=$Html.Contains('data-progress="0"') -and $Html.Contains('data-progress="2"') -and $Js.Contains('STAGES=[')},
 @{Name="Prefilled career philosopher example";Value=$Js.Contains('const guided=') -and $Js.Contains('career.go.kr') -and $Js.Contains('work24.go.kr')},
 @{Name="Blank personal practice";Value=$Html.Contains('personalMode') -and $Js.Contains('const blank=') -and $Js.Contains('function setMode')},
 @{Name="AI-assisted data-card prompt";Value=$Html.Contains('copyResearchPrompt') -and $Js.Contains('function researchPrompt')},
 @{Name="Runnable data-based MVP";Value=$Html.Contains('mvpChat') -and $Html.Contains('sendMvpQuestion') -and $Js.Contains('function findCard') -and $Js.Contains('function sendQuestion')},
 @{Name="Standalone HTML export";Value=$Html.Contains('downloadHtml') -and $Js.Contains('function standaloneHtml')},
 @{Name="No API or network integration";Value=(-not $Js.Contains('fetch(')) -and (-not $Js.Contains('api.openai')) -and (-not $Js.Contains('apiKey'))},
 @{Name="Local storage";Value=$Js.Contains('localStorage')}
)
$Failed=@();foreach($Check in $Checks){if($Check.Value){Write-Host "PASS: $($Check.Name)"}else{Write-Host "FAIL: $($Check.Name)";$Failed+=$Check.Name}}
if($Failed.Count){throw "LEVEL 1 static validation failed: $($Failed -join ', ')"};Write-Host "PASS: LEVEL 1 simple chatbot validation"
