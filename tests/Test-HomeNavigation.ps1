Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
function Get-Page([string]$RelativePath) {
    Get-Content -LiteralPath (Join-Path $Root $RelativePath) -Raw
}

$Portal = Get-Page "portal\index.html"
$HomeCss = Get-Page "portal\assets\home-nav.css"
$DirectHomePages = @(
    "portal\foundation\index.html",
    "portal\foundation\presentation\index.html",
    "portal\workshops\level-1\index.html",
    "portal\workshops\level-2\index.html",
    "portal\workshops\level-3\index.html",
    "portal\workshops\level-4\index.html"
)
$PaperPages = @(
    "portal\worksheets\index.html",
    "portal\worksheets\level-1.html",
    "portal\worksheets\level-2.html",
    "portal\worksheets\level-3.html",
    "portal\worksheets\level-4.html"
)

$Checks = @(
    @{ Name = "Portal brands itself as HOME"; Value = $Portal.Contains("PROJECT PLAYGROUND <b>HOME</b>") -and $Portal.Contains('class="home-link"') -and $Portal.Contains('aria-current="page"') },
    @{ Name = "Home navigation styling keeps HOME visible on mobile"; Value = $HomeCss.Contains(".nav-links a.home-link") },
    @{ Name = "Foundation presentation returns directly to portal home"; Value = (Get-Page "portal\foundation\presentation\index.html").Contains('href="../../index.html"') },
    @{ Name = "Project papers retain portal return paths"; Value = (@($PaperPages | Where-Object { -not (Get-Page $_).Contains('href="../index.html"') }).Count -eq 0) }
)

foreach ($Page in $DirectHomePages) {
    $Expected = if ($Page -eq "portal\foundation\index.html") { 'href="../index.html"' } else { 'href="../../index.html"' }
    $Checks += @{ Name = "$Page links to PROJECT PLAYGROUND home"; Value = (Get-Page $Page).Contains($Expected) -and (Get-Page $Page).Contains("PROJECT PLAYGROUND") }
}

$Failed = @()
foreach ($Check in $Checks) {
    if ($Check.Value) { Write-Host "PASS: $($Check.Name)" }
    else { Write-Host "FAIL: $($Check.Name)"; $Failed += $Check.Name }
}
if ($Failed.Count) { throw "Home navigation validation failed: $($Failed -join ', ')" }
Write-Host "PASS: Home navigation validation"
