Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Module = Join-Path $Root "portal\modules\level-1-chat-agent"
$Files = @("index.html", "level1.css", "level1-gates.css", "level1.js", "README.md")
foreach ($Name in $Files) {
    if (-not (Test-Path -LiteralPath (Join-Path $Module $Name) -PathType Leaf)) { throw ("Missing LEVEL 1 file: " + $Name) }
}
$Html = Get-Content -LiteralPath (Join-Path $Module "index.html") -Raw
$Js = Get-Content -LiteralPath (Join-Path $Module "level1.js") -Raw
$Checks = @(
    @{ Name = "Conversation role design"; Value = $Html.Contains('data-bind="role"') -and $Html.Contains('data-bind="boundaries"') },
    @{ Name = "Complete starter profile for new draft"; Value = $Js.Contains('진로에 대한 고민이 많은 학생들의 고민을 해결해주는 철학자 대화봇') -and $Js.Contains('STARTER_PROFILE') -and $Js.Contains('커리어넷') -and $Js.Contains('고용24') -and $Js.Contains('Stanford Encyclopedia of Philosophy') },
    @{ Name = "Topic feasibility gate"; Value = $Html.Contains('topicFit') -and $Html.Contains('expectedQuestions') -and $Js.Contains('function feasibilityMissing') },
    @{ Name = "Reliable source gate"; Value = $Html.Contains('sourceRecords') -and $Js.Contains('reliableSources') -and $Js.Contains('sourceUsable') },
    @{ Name = "AI feasibility helper and test-mode decision"; Value = $Html.Contains('copyFeasibilityPrompt') -and $Html.Contains('feasibilityAiResponse') -and $Html.Contains('feasibilityDecision') -and $Js.Contains('function feasibilityPrompt') -and $Js.Contains('TEST_MODE=true') -and $Js.Contains('if(!TEST_MODE&&missing.length)') },
    @{ Name = "Manual external AI workflow"; Value = $Html.Contains('외부 채팅 AI') -and $Js.Contains('navigator.clipboard') },
    @{ Name = "Build and test MVP previews"; Value = $Html.Contains('previewChat') -and $Html.Contains('validationChat') -and $Html.Contains('runPreview') -and $Html.Contains('showValidationPreview') -and $Js.Contains('function renderMvpPreview') -and $Js.Contains('function renderValidationPreview') },
    @{ Name = "Pinpoint revision page and revalidation loop"; Value = $Html.Contains('data-step="4"') -and $Html.Contains('revisionSourceSummary') -and $Html.Contains('revisionIssue') -and $Html.Contains('revisionOutcome') -and $Html.Contains('copyPinpointPrompt') -and $Html.Contains('finalPrompt') -and $Html.Contains('applyFinalPrompt') -and $Js.Contains('function pinpointPrompt') -and $Js.Contains('function applyFinalPrompt') -and $Js.Contains('function savePinpointPlan') -and $Js.Contains('validationVersions') },
    @{ Name = "Source scope and honesty"; Value = $Html.Contains('data-bind="sources"') -and $Js.Contains('출처를 만들지 마라') },
    @{ Name = "Conversation validation"; Value = $Html.Contains('testQuestion') -and $Html.Contains('stayedInRole') -and $Js.Contains('testFinding') },
    @{ Name = "Five-page workspace"; Value = $Html.Contains('data-step="0"') -and $Html.Contains('data-step="4"') -and $Js.Contains('function renderStage') -and $Js.Contains('function gateMessage') },
    @{ Name = "Package export"; Value = $Html.Contains('downloadPackage') -and $Js.Contains('function packageMarkdown') },
    @{ Name = "Local storage"; Value = $Js.Contains('localStorage') },
    @{ Name = "No API or network integration"; Value = -not $Js.Contains('fetch(') -and -not $Js.Contains('api.openai') }
)
$Failed = @()
foreach ($Check in $Checks) { if ($Check.Value) { Write-Host ("PASS: " + $Check.Name) } else { Write-Host ("FAIL: " + $Check.Name); $Failed += $Check.Name } }
if ($Failed.Count -gt 0) { throw ("LEVEL 1 static validation failed: " + ($Failed -join ", ")) }
Write-Host "PASS: LEVEL 1 chat-agent static validation"
