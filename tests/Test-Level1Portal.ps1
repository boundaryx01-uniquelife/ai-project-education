Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Module = Join-Path $Root "portal\modules\level-1-chat-agent"
$Files = @("index.html", "level1.css", "level1.js", "README.md")
foreach ($Name in $Files) {
    if (-not (Test-Path -LiteralPath (Join-Path $Module $Name) -PathType Leaf)) { throw ("Missing LEVEL 1 file: " + $Name) }
}
$Html = Get-Content -LiteralPath (Join-Path $Module "index.html") -Raw
$Js = Get-Content -LiteralPath (Join-Path $Module "level1.js") -Raw
$Checks = @(
    @{ Name = "Conversation role design"; Value = $Html.Contains('data-bind="role"') -and $Html.Contains('data-bind="boundaries"') },
    @{ Name = "Manual external AI workflow"; Value = $Html.Contains('외부 채팅 AI') -and $Js.Contains('navigator.clipboard') },
    @{ Name = "Source scope and honesty"; Value = $Html.Contains('data-bind="sources"') -and $Js.Contains('출처를 만들지 마라') },
    @{ Name = "Conversation validation"; Value = $Html.Contains('testQuestion') -and $Html.Contains('stayedInRole') -and $Js.Contains('testFinding') },
    @{ Name = "Package export"; Value = $Html.Contains('downloadPackage') -and $Js.Contains('function packageMarkdown') },
    @{ Name = "Local storage"; Value = $Js.Contains('localStorage') },
    @{ Name = "No API or network integration"; Value = -not $Js.Contains('fetch(') -and -not $Js.Contains('api.openai') }
)
$Failed = @()
foreach ($Check in $Checks) { if ($Check.Value) { Write-Host ("PASS: " + $Check.Name) } else { Write-Host ("FAIL: " + $Check.Name); $Failed += $Check.Name } }
if ($Failed.Count -gt 0) { throw ("LEVEL 1 static validation failed: " + ($Failed -join ", ")) }
Write-Host "PASS: LEVEL 1 chat-agent static validation"
