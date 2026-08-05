[CmdletBinding()]
param(
    [string]$ProjectRoot = "C:\DEV\ai-project-education",
    [string]$GitHubOwner = "foruniquelife00",
    [string]$RepositoryName = "ai-project-education",
    [ValidateSet("public", "private", "internal")]
    [string]$Visibility = "public"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host ("[STEP] " + $Message)
}

function Refresh-Path {
    $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $env:Path = $machinePath + ";" + $userPath
}

function Test-Command {
    param([string]$Name)
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Install-WingetPackage {
    param(
        [string]$Id,
        [string]$DisplayName
    )

    if (-not (Test-Command "winget")) {
        throw "winget is required to install missing tools."
    }

    Write-Step ("Install " + $DisplayName)

    & winget install `
        --id $Id `
        --exact `
        --accept-package-agreements `
        --accept-source-agreements

    if ($LASTEXITCODE -ne 0) {
        throw ("winget installation failed: " + $Id)
    }

    Refresh-Path
}

function Write-Base64File {
    param(
        [string]$Path,
        [string]$Base64
    )

    $parent = Split-Path -Parent $Path
    if (-not (Test-Path -LiteralPath $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    if (Test-Path -LiteralPath $Path) {
        throw ("Refusing to overwrite file: " + $Path)
    }

    [System.IO.File]::WriteAllBytes(
        $Path,
        [Convert]::FromBase64String($Base64)
    )
}

function Write-AsciiFile {
    param(
        [string]$Path,
        [string]$Content
    )

    $parent = Split-Path -Parent $Path
    if (-not (Test-Path -LiteralPath $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    if (Test-Path -LiteralPath $Path) {
        throw ("Refusing to overwrite file: " + $Path)
    }

    [System.IO.File]::WriteAllText(
        $Path,
        $Content,
        [System.Text.Encoding]::ASCII
    )
}

function Invoke-Git {
    param([string[]]$Arguments)

    & git @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw ("Git command failed: git " + ($Arguments -join " "))
    }
}

function Invoke-Gh {
    param([string[]]$Arguments)

    & gh @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw ("GitHub CLI command failed: gh " + ($Arguments -join " "))
    }
}

Write-Step "Validate script syntax"

$tokens = $null
$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile(
    $PSCommandPath,
    [ref]$tokens,
    [ref]$parseErrors
) | Out-Null

if ($parseErrors.Count -gt 0) {
    $parseErrors | ForEach-Object { Write-Error $_.Message }
    throw "PowerShell parser validation failed."
}

$resolvedRoot = [System.IO.Path]::GetFullPath($ProjectRoot)
$resolvedScript = [System.IO.Path]::GetFullPath($PSCommandPath)
$expectedScriptFolder = Join-Path $resolvedRoot "tools\setup"

if (-not $resolvedScript.StartsWith(
    [System.IO.Path]::GetFullPath($expectedScriptFolder),
    [System.StringComparison]::OrdinalIgnoreCase
)) {
    throw @"
Save and run this script inside:
C:\DEV\ai-project-education\tools\setup
"@
}

Write-Step "Check the clean project root"

$existingFiles = @(
    Get-ChildItem -LiteralPath $resolvedRoot -File -Recurse -Force |
    Where-Object {
        [System.IO.Path]::GetFullPath($_.FullName) -ne $resolvedScript
    }
)

if ($existingFiles.Count -gt 0) {
    $existingFiles | ForEach-Object { Write-Host $_.FullName }
    throw "Project root contains files other than this setup script."
}

if (Test-Path -LiteralPath (Join-Path $resolvedRoot ".git")) {
    throw "A Git repository already exists in the project root."
}

Write-Step "Check and install Git tools"

if (-not (Test-Command "git")) {
    Install-WingetPackage -Id "Git.Git" -DisplayName "Git"
}

if (-not (Test-Command "gh")) {
    Install-WingetPackage -Id "GitHub.cli" -DisplayName "GitHub CLI"
}

if (-not (Test-Command "git")) {
    throw "Git is not available."
}

if (-not (Test-Command "gh")) {
    throw "GitHub CLI is not available."
}

Write-Step "Authenticate the required GitHub account"

& gh auth status
if ($LASTEXITCODE -ne 0) {
    Invoke-Gh -Arguments @(
        "auth",
        "login",
        "--hostname",
        "github.com",
        "--git-protocol",
        "https",
        "--web"
    )
}

$authenticatedOwner = (& gh api user --jq ".login")
if ($LASTEXITCODE -ne 0) {
    throw "Unable to read the authenticated GitHub account."
}

if ($authenticatedOwner.Trim() -ne $GitHubOwner) {
    throw @"
The authenticated GitHub account does not match the required owner.

Required:
$GitHubOwner

Run:
gh auth switch
"@
}

$fullName = $GitHubOwner + "/" + $RepositoryName

$repoCheckCommand = `
    'gh repo view "' + $fullName + '" --json nameWithOwner 1>nul 2>nul'

& cmd.exe /d /c $repoCheckCommand
$repoExists = ($LASTEXITCODE -eq 0)

if ($repoExists) {
    throw ("GitHub repository already exists: " + $fullName)
}

Write-Step "Create the integrated repository structure"

$directories = @(
    ".github\ISSUE_TEMPLATE",
    ".github\workflows",
    "docs\00_governance",
    "docs\01_architecture",
    "docs\02_curriculum_design",
    "docs\03_platform_design",
    "docs\04_operations",
    "docs\decisions",
    "docs\handoffs",
    "curriculum\shared",
    "curriculum\level-1-chat-agent",
    "curriculum\level-2-web-agent",
    "curriculum\level-3-data-agent",
    "curriculum\level-4-project-agent",
    "portal\assets",
    "portal\modules",
    "skills\ai-project-education\core",
    "skills\ai-project-education\adapters",
    "templates",
    "examples",
    "rubrics",
    "tools\setup",
    "tools\validation",
    "tools\release",
    "tests"
)

foreach ($relativePath in $directories) {
    New-Item `
        -ItemType Directory `
        -Path (Join-Path $resolvedRoot $relativePath) `
        -Force | Out-Null
}

Write-Step "Write the governance and project files"

Write-Base64File `
    -Path (Join-Path $resolvedRoot "README.md") `
    -Base64 "77u/IyBBSSDtlITroZzsoJ3tirgg6rWQ7JyhIO2Gte2VqSDtlITroIjsnoTsm4ztgawKCkFJ66W8IO2ZnOyaqe2VnCDsnpDro4wg7IiY7KeRLCDrtoTshJ0sIOyEpOqzhCwg7KCc7J6RLCDqsoDspp0sIOuwsO2PrOyZgCDqsJzshKDsnYQg7ZWY64KY7J2YIOq1kOycoSDssrTqs4TroZwg66eM65Oc64qUIOyepeq4sCDtlITroZzsoJ3tirjsnoXri4jri6QuCgojIyDqs7Xsi50g6riw7KSACgotIO2UhOuhnOygne2KuCBJRDogYGFpLXByb2plY3QtZWR1Y2F0aW9uYAotIOuhnOy7rCDqsr3roZw6IGBDOlxERVZcYWktcHJvamVjdC1lZHVjYXRpb25gCi0g6rO17IudIOyggOyepeyGjDogYGZvcnVuaXF1ZWxpZmUwMC9haS1wcm9qZWN0LWVkdWNhdGlvbmAKLSDquLDrs7gg67Cw7Y+sOiBHaXRIdWIgUGFnZXMKCiMjIOqzte2GtSDsg53rqoXso7zquLAKCmBERUZJTkUg4oaSIENPTExFQ1Qg4oaSIFNUUlVDVFVSRSDihpIgQlVJTEQg4oaSIFRFU1Qg4oaSIFBVQkxJU0gg4oaSIElNUFJPVkVgCgojIyDtlbXsi6wg7JuQ7LmZCgotIOuLqOyInCDtlITroaztlITtirgg7LK07ZeY7J2EIOuEmOyWtCDtlITroZzsoJ3tirgg7KCE7LK0IO2dkOumhOydhCDqsIDrpbTsuZzri6QuCi0g66qo65OgIOugiOuyqOydgCDqsJnsnYAg7Ya17ZWpIO2PrO2EuOqzvCDqs7XthrUg7J6Q66OM66W8IOyCrOyaqe2VnOuLpC4KLSDsiJjsl4XslYgsIOybue2PrO2EuCwgU2tpbGzqs7wg7Y+J6rCA7LK06rOE66W8IO2VmOuCmOydmCDsoIDsnqXshozsl5DshJwg67Cc7KCE7Iuc7YKo64ukLgo="

Write-Base64File `
    -Path (Join-Path $resolvedRoot "docs\00_governance\AI_PROJECT_EDUCATION_FRAMEWORK_BASELINE_20260805_R03.md") `
    -Base64 "77u/IyBBSSDtlITroZzsoJ3tirgg6rWQ7JyhIO2Gte2VqSDtlITroIjsnoTsm4ztgawg6riw7KSA7IScCgotIOyekeyEseydvDogMjAyNi0wOC0wNQotIOuyhOyghDogUjAzCi0g7IOB7YOcOiBCQVNFTElORV9QUk9QT1NFRAotIO2UhOuhnOygne2KuOuqhTogQUkg7ZSE66Gc7KCd7Yq4IOq1kOycoSDthrXtlakg7ZSE66CI7J6E7JuM7YGsCi0g7JiB66y466qFOiBBSSBQcm9qZWN0IEVkdWNhdGlvbiBGcmFtZXdvcmsKLSDroZzsu6wg6riw7KSAIOqyveuhnDogYEM6XERFVlxhaS1wcm9qZWN0LWVkdWNhdGlvbmAKLSBHaXRIdWIg6riw7KSAIOyggOyepeyGjDogYGZvcnVuaXF1ZWxpZmUwMC9haS1wcm9qZWN0LWVkdWNhdGlvbmAKCiMjIDEuIOygleyglSDsgqztla0KCuydtCDtlITroZzsoJ3tirjsl5DripQg67OE64+E7J2YIGBfYm9vdHN0cmFwYCwgYF9wYWNrYWdlc2AsIOyehOyLnCDtlITroZzsoJ3tirgg7Y+0642U66W8IOuRkOyngCDslYrripTri6QuCgrstIjquLDtmZQg7Iqk7YGs66a97Yq464+EIO2UhOuhnOygne2KuCDrgrTrtoDsnZgg64uk7J2MIOqyveuhnOyXkCDsoIDsnqXtlZzri6QuCgpgQzpcREVWXGFpLXByb2plY3QtZWR1Y2F0aW9uXHRvb2xzXHNldHVwYAoK7Y+0642UIOyDneyEsSwg66y47IScIOyDneyEsSwgR2l0IOy0iOq4sO2ZlCwgR2l0SHViIOyggOyepeyGjCDsg53shLHqs7wg67Cw7Y+sIOyEpOygleydgCDrqqjrkZAgUG93ZXJTaGVsbOuhnCDsiJjtlontlZzri6QuCgojIyAyLiDtlITroZzsoJ3tirjsnZgg64uo7J28IOuqqeyggQoK7J20IOyggOyepeyGjOuKlCDsl6zrn6wg6rCc7J2YIOuPheumvSDqtZDsnKHsnpDro4zrpbwg66qo7JWE65GQ64qUIOywveqzoOqwgCDslYTri4jri6QuCgpBSeulvCDtmZzsmqntlZwg7ZSE66Gc7KCd7Yq4IOq1kOycoeydmCDshKTqs4Qg7JuQ66asLCDri6jqs4Trs4Qg6rWQ7Jyh6rO87KCVLCDsi6TsirXtmJUg7Ju57Y+s7YS4LCDrspTsmqkgU2tpbGwsIOyYiOyLnCDtlITroZzsoJ3tirgsIO2FnO2UjOumvywg7Y+J6rCA64+E6rWs7JmAIOyatOyYgSDquLDroZ3snYQg7ZWY64KY7J2YIOyytOqzhOuhnCDsp4Dsho3soIHsnLzroZwg67Cc7KCE7Iuc7YKk64qUIO2Gte2VqSDtlITroIjsnoTsm4ztgazsnbTri6QuCgojIyAzLiDri6jsnbwg7JuQ67O4IOybkOy5mQoKLSDqs7Xsi50g7JuQ67O47J2AIEdpdEh1YiDsoIDsnqXshozsnZggYG1haW5gIOu4jOuenOy5mOydtOuLpC4KLSDroZzsu6wg7Y+0642U64qUIEdpdEh1YiDsoIDsnqXshozsnZgg7J6R7JeFIOyCrOuzuOydtOuLpC4KLSDrqqjrk6Ag7Iq57J24IOqysOygleydgCBNYXJrZG93biDrrLjshJzsmYAg7Luk67CL7Jy866GcIOuCqOq4tOuLpC4KLSDroIjrsqjrs4Qg6rO87KCV66eI64ukIOyDiOuhnOyatCDsoIDsnqXshozrpbwg66eM65Ok7KeAIOyViuuKlOuLpC4KLSDqtZDsnKEg7Ju57Y6Y7J207KeA64+EIO2VmOuCmOydmCDtj6zthLgg7JWI7JeQ7IScIOqzvOyglSDrqqjrk4jsnYQg7ZmV7J6l7ZWc64ukLgotIO2UjOueq+2PvOuzhCBTa2lsbOydgCDqs7XthrUg7ZW17Ius7J2EIOuzteygnO2VmOyngCDslYrqs6Ag7Ja064yR7YSw66GcIOyXsOqysO2VnOuLpC4KCiMjIDQuIOyghOyytCDqtazsobAKCmBgYHRleHQKQzpcREVWXGFpLXByb2plY3QtZWR1Y2F0aW9uCuKUnOKUgCAuZ2l0aHViLwrilIIgIOKUnOKUgCBJU1NVRV9URU1QTEFURS8K4pSCICDilJTilIAgd29ya2Zsb3dzLwrilJzilIAgZG9jcy8K4pSCICDilJzilIAgMDBfZ292ZXJuYW5jZS8K4pSCICDilJzilIAgMDFfYXJjaGl0ZWN0dXJlLwrilIIgIOKUnOKUgCAwMl9jdXJyaWN1bHVtX2Rlc2lnbi8K4pSCICDilJzilIAgMDNfcGxhdGZvcm1fZGVzaWduLwrilIIgIOKUnOKUgCAwNF9vcGVyYXRpb25zLwrilIIgIOKUnOKUgCBkZWNpc2lvbnMvCuKUgiAg4pSU4pSAIGhhbmRvZmZzLwrilJzilIAgY3VycmljdWx1bS8K4pSCICDilJzilIAgc2hhcmVkLwrilIIgIOKUnOKUgCBsZXZlbC0xLWNoYXQtYWdlbnQvCuKUgiAg4pSc4pSAIGxldmVsLTItd2ViLWFnZW50LwrilIIgIOKUnOKUgCBsZXZlbC0zLWRhdGEtYWdlbnQvCuKUgiAg4pSU4pSAIGxldmVsLTQtcHJvamVjdC1hZ2VudC8K4pSc4pSAIHBvcnRhbC8K4pSCICDilJzilIAgYXNzZXRzLwrilIIgIOKUnOKUgCBtb2R1bGVzLwrilIIgIOKUlOKUgCBpbmRleC5odG1sCuKUnOKUgCBza2lsbHMvCuKUgiAg4pSU4pSAIGFpLXByb2plY3QtZWR1Y2F0aW9uLwrilIIgICAgIOKUnOKUgCBTS0lMTC5tZArilIIgICAgIOKUnOKUgCBjb3JlLwrilIIgICAgIOKUlOKUgCBhZGFwdGVycy8K4pSc4pSAIHRlbXBsYXRlcy8K4pSc4pSAIGV4YW1wbGVzLwrilJzilIAgcnVicmljcy8K4pSc4pSAIHRvb2xzLwrilIIgIOKUnOKUgCBzZXR1cC8K4pSCICDilJzilIAgdmFsaWRhdGlvbi8K4pSCICDilJTilIAgcmVsZWFzZS8K4pSc4pSAIHRlc3RzLwrilJzilIAgUkVBRE1FLm1kCuKUnOKUgCBMSUNFTlNFCuKUnOKUgCAuZ2l0aWdub3JlCuKUlOKUgCAuZ2l0YXR0cmlidXRlcwpgYGAKCiMjIDUuIO2PtOuNlOuzhCDssYXsnoQKCiMjIyBgZG9jc2AKCu2UhOuhnOygne2KuCDtl4zsnqUsIOq1rOyhsCDshKTqs4QsIOqysOyglSDquLDroZ0sIOuLqOqzhOuzhCDtlbjrk5zsmKTtlITsmYAg7Jq07JiBIOusuOyEnOulvCDqtIDrpqztlZzri6QuCgojIyMgYGN1cnJpY3VsdW1gCgrsiJjsl4Ug7Iuc7IiY7JmAIOuCnOydtOuPhOyXkCDrlLDrpbgg7Iuk7KCcIOq1kOycoeqzvOyglSDsvZjthZDsuKDrpbwg6rSA66as7ZWc64ukLiDrqqjrk6Ag66CI67Ko7J2AIOqzte2GtSDsg53rqoXso7zquLDrpbwg7IKs7Jqp7ZWc64ukLgoKYERFRklORSDihpIgQ09MTEVDVCDihpIgU1RSVUNUVVJFIOKGkiBCVUlMRCDihpIgVEVTVCDihpIgUFVCTElTSCDihpIgSU1QUk9WRWAKCiMjIyBgcG9ydGFsYAoK6rWQ7Jyh7J6Q6rCAIOuwsO2PrO2VmOqzoCDtlZnsirXsnpDqsIAg7KeB7KCRIOyCrOyaqe2VmOuKlCDri6jsnbwg7Ju57Y+s7YS47J2064ukLiDroIjrsqjrs4Qg7IiY7JeF7J2AIOuzhOuPhCDsm7nsgqzsnbTtirjqsIAg7JWE64uI6528IO2PrO2EuOydmCDrqqjrk4jroZwg7LaU6rCA7ZWc64ukLgoKIyMjIGBza2lsbHNgCgpDaGF0R1BULCBDb2RleCwgQ2xhdWRlIENvZGUsIEFudGlncmF2aXR5IOuTseyXkOyEnCDsnqzsgqzsmqntlaAg6rO17Ya1IOyekeyXheuyleydhCDqtIDrpqztlZzri6QuIOqzte2GtSDtlbXsi6zqs7wg7ZSM656r7Y+8IOyWtOuMke2EsOulvCDrtoTrpqztlZzri6QuCgojIyMgYHRlbXBsYXRlc2AsIGBleGFtcGxlc2AsIGBydWJyaWNzYAoK66qo65OgIOqzvOygleydtCDqs7Xrj5nsnLzroZwg7IKs7Jqp7ZWY64qUIO2FnO2UjOumvywg7JmE7ISxIOyYiOyLnCwg7Y+J6rCA7ZGc66W8IOq0gOumrO2VnOuLpC4g6rO87KCVIO2PtOuNlCDslYjsl5Ag6rCZ7J2AIOyekOujjOulvCDspJHrs7Ug7KCA7J6l7ZWY7KeAIOyViuuKlOuLpC4KCiMjIyBgdG9vbHNgCgpQb3dlclNoZWxsIOq4sOuwmCDstIjquLDtmZQsIOqygOymnSwg67Cw7Y+s7JmAIOumtOumrOyKpCDrj4Tqtazrpbwg6rSA66as7ZWc64ukLgoKIyMgNi4g6rWQ7Jyh6rO8IOybue2PrO2EuOydmCDqtIDqs4QKCuq1kOycoeqzvOygleydtCDsm5Drs7jsnbTqs6Ag7Y+s7YS47J2AIOydtOulvCDsoITri6ztlZjripQg7Iuk7ZaJIO2ZmOqyveydtOuLpC4KCmBgYHRleHQK6rWQ7JyhIOyyoO2VmeqzvCDquLDspIAKICAgICAgICDihpMK6rO17Ya1IO2UhOuhnOygne2KuCDsg53rqoXso7zquLAKICAgICAgICDihpMK66CI67Ko67OEIOq1kOycoeqzvOyglQogICAgICAgIOKGkwrsmIjsi5zCt+2FnO2UjOumv8K37Y+J6rCA7ZGcCiAgICAgICAg4oaTCuuLqOydvCDtlZnsirUg7Y+s7YS4CiAgICAgICAg4oaTClNraWxs6rO8IO2UjOueq+2PvCDslrTrjJHthLAKYGBgCgrsm7ntj6zthLjsnbQg6rWQ7Jyh6rO87KCV6rO8IOuUsOuhnCDsp4TtmZTtlZjsp4Ag7JWK64+E66GdIOqwgSDtj6zthLgg66qo65OI7J2AIOuwmOuTnOyLnCDrjIDsnZHtlZjripQg6rWQ7Jyh6rO87KCVIOusuOyEnOulvCDqsIDsp4Tri6QuCgojIyA3LiDri6jqs4Trs4Qg7LaU7KeEIOq1rOyhsAoKIyMjIFNUQUdFIDAwLiDthrXtlakg6riw67CYIO2ZleyglQoKLSDtlITroZzsoJ3tirgg7ZeM7J6lCi0g65SU66CJ7YSw66asIOq1rOyhsAotIEdpdEh1YiDsoIDsnqXCt+uwsO2PrCDquLDspIAKLSDrrLjshJzCt+uyhOyghCDqt5zsuZkKLSDqs7XthrUg7IOd66qF7KO86riwCi0g7LWc7LSIIOyggOyepeyGjOyZgCDtj6zthLgg6rOo6rKpCgojIyMgU1RBR0UgMDEuIOyghOyytCDqtZDsnKHqs7zsoJUg7LK06rOEIOyEpOqzhAoKLSDqtZDsnKEg64yA7IOBCi0g66CI67KoIOyytOqzhAotIOyLnOyImOuzhCDsmYTro4wg7KGw6rG0Ci0g6rO17Ya1IOyXreufiQotIO2PieqwgCDssrTqs4QKLSDsnpDsnKDrj4Qg7ISk6rOECgojIyMgU1RBR0UgMDIuIExFVkVMIDEg7Iuc67KUIOqzvOyglQoKLSAz7Iuc6rCEIOyxhO2Mhe2YlSDrr7jri4gg7JeQ7J207KCE7Yq4Ci0g6rWQ7IKs7JqpIOynhO2WieyViAotIO2VmeyKteyekCDtmZzrj5kKLSDsmIjsi5wg7ZSE66Gc7KCd7Yq4Ci0g7Y+J6rCAIOujqOu4jOumrQoKIyMjIFNUQUdFIDAzLiDthrXtlakg7Ju57Y+s7YS4IE1WUAoKLSDri6jqs4TtmJUg7ZWZ7Iq1IO2ZlOuptAotIO2UhOuhrO2UhO2KuCDsobDrpr0KLSDqsrDqs7wg6riw66GdCi0g7LK07YGs66as7Iqk7Yq4Ci0g64K067O064K06riwCi0gR2l0SHViIFBhZ2VzIOuwsO2PrAoKIyMjIFNUQUdFIDA0LiBMRVZFTCAyIOuwsO2PrO2YlSDqs7zsoJUKCi0gNH427Iuc6rCEIOybuSDsl5DsnbTsoITtirgKLSDqs7XthrUg7Ju5IO2FnO2UjOumvwotIEdpdEh1YiDquLDrsJgg67Cw7Y+sIOyLpOyKtQotIOyYpO2UhOudvOyduCDtjKjtgqTsp4AKCiMjIyBTVEFHRSAwNS4gU2tpbGwg7Yyo7YKk7KeACgotIOqzte2GtSBgU0tJTEwubWRgCi0gQ2hhdEdQVCDslrTrjJHthLAKLSBDb2RleCDslrTrjJHthLAKLSBDbGF1ZGUgQ29kZSDslrTrjJHthLAKLSBBbnRpZ3Jhdml0eSDslrTrjJHthLAKCiMjIyBTVEFHRSAwNi4g7J6Q66OMIOyXsOqysOqzvCBNQ1Ag7ZmV7J6lCgotIO2MjOydvOqzvCDqs7XqsJwg642w7J207YSwCi0g7Lac7LKY7JmAIOy1nOyLoOyEsQotIE1DUCDsnb3quLAg7KCE7JqpIOyLpOyKtQotIOqwnOyduOygleuztOyZgCDqtoztlZwKCiMjIyBTVEFHRSAwNy4g7Jq07JiB6rO8IO2ZleyCsAoKLSDsiJjsl4Ug7ZS865Oc67CxCi0g67KE7KCE67OEIFJlbGVhc2UKLSDqtZDsgqwg6riw7JesIOuwqeyLnQotIOyYpOulmMK36rCc7ISgIElzc3VlCi0g6rWQ7Jyh7IKs66GAIOy2leyggQoKIyMgOC4gR2l0SHViIOyatOyYgSDqt5zsuZkKCi0g6riw67O4IOu4jOuenOy5mOuKlCBgbWFpbmAg7ZWY64KY66GcIOyLnOyeke2VnOuLpC4KLSDsi6TsoJwg7J6R7JeF7J2AIGBmZWF0dXJlLzxzdGFnZS1vci10b3BpYz5gIOu4jOuenOy5mOulvCDsgqzsmqntlZzri6QuCi0gYG1haW5g7JeQ64qUIOyKueyduOuQnCDquLDspIDqs7wg67Cw7Y+sIOqwgOuKpe2VnCDsnpDro4zrp4wg65GU64ukLgotIEdpdEh1YiBJc3N1ZXPripQg7Jik66WYLCDqsJzshKDslYjqs7wg7IiY7JeFIO2UvOuTnOuwsSDquLDroZ3sl5Ag7IKs7Jqp7ZWc64ukLgotIEdpdEh1YiBSZWxlYXNlc+uKlCDsiJjsl4Ug67KE7KCE6rO8IOyYpO2UhOudvOyduCDtjKjtgqTsp4Ag67Cw7Y+s7JeQIOyCrOyaqe2VnOuLpC4KLSBHaXRIdWIgUGFnZXPripQg64uo7J28IOq1kOycoe2PrO2EuOydmCDquLDrs7gg67Cw7Y+s7LKY66GcIOyCrOyaqe2VnOuLpC4KLSDshJzrsoQg6riw64ql7J20IO2VhOyalO2VoCDrlYzrj4Qg6rCZ7J2AIOyggOyepeyGjOulvCDsnKDsp4DtlZjqs6Ag67Cw7Y+sIOqzhOy4teunjCDtmZXsnqXtlZzri6QuCgojIyA5LiDrqoXrqoUg6rec7LmZCgrtlITroZzsoJ3tirjsmYAg7KCA7J6l7IaMIOydtOumhOydgCDslZ7snLzroZwg67OA6rK97ZWY7KeAIOyViuuKlOuLpC4KCi0g7ZSE66Gc7KCd7Yq4IElEOiBgYWktcHJvamVjdC1lZHVjYXRpb25gCi0g66Gc7LusIO2PtOuNlDogYEM6XERFVlxhaS1wcm9qZWN0LWVkdWNhdGlvbmAKLSBHaXRIdWIg7KCA7J6l7IaMOiBgZm9ydW5pcXVlbGlmZTAwL2FpLXByb2plY3QtZWR1Y2F0aW9uYAotIO2PrO2EuCDtj7TrjZQ6IGBwb3J0YWxgCi0g6rO17Ya1IFNraWxsOiBgc2tpbGxzL2FpLXByb2plY3QtZWR1Y2F0aW9uYAoK66y47IScIO2MjOydvOuqheydgCDri6TsnYwg7ZiV7Iud7J2EIOyCrOyaqe2VnOuLpC4KCmA8RE9DVU1FTlRfTkFNRT5fWVlZWU1NREQubWRgCgrqsJnsnYAg64Kg7Kec7J2YIOqwnOygleuzuOydgCBgX1IwMmAsIGBfUjAzYOydhCDrtpnsnbjri6QuCgojIyAxMC4g7LSI6riwIOyZhOujjCDsobDqsbQKCuuLpOydjCDsobDqsbTsnbQg7Lap7KGx65CY7Ja07JW8IO2UhOuhnOygne2KuOqwgCDsi5zsnpHrkJwg6rKD7Jy866GcIOuzuOuLpC4KCi0g6riw7KSAIO2PtOuNlOqwgCBQb3dlclNoZWxs66GcIOyDneyEseuQmOyXiOuLpC4KLSDthrXtlakg65SU66CJ7YSw66asIOq1rOyhsOqwgCDsg53shLHrkJjsl4jri6QuCi0gUjAzIOq4sOykgOyEnOyZgCDqsrDsoJUg6riw66Gd7J20IOyggOyepeuQmOyXiOuLpC4KLSBHaXQg7KCA7J6l7IaM6rCAIGBtYWluYOycvOuhnCDstIjquLDtmZTrkJjsl4jri6QuCi0gYGZvcnVuaXF1ZWxpZmUwMC9haS1wcm9qZWN0LWVkdWNhdGlvbmAg7KCA7J6l7IaM6rCAIOyDneyEseuQmOyXiOuLpC4KLSDstZzstIgg7Luk67CL6rO8IFB1c2jqsIAg7JmE66OM65CY7JeI64ukLgotIOuLqOydvCDtj6zthLgg6rOo6rKp7J20IEdpdEh1YiBQYWdlc+uhnCDrsLDtj6zrkJjsl4jri6QuCi0g7J207ZuEIOyekeyXheydhCBTVEFHReuzhCDrrLjshJzsmYAg67iM656c7LmY66GcIOydtOyWtOqwiCDsiJgg7J6I64ukLgo="

Write-Base64File `
    -Path (Join-Path $resolvedRoot "docs\decisions\DECISION_LOG_20260805.md") `
    -Base64 "77u/IyBBSSDtlITroZzsoJ3tirgg6rWQ7JyhIO2Gte2VqSDtlITroIjsnoTsm4ztgawg6rKw7KCVIOq4sOuhnQoKLSDsnpHshLHsnbw6IDIwMjYtMDgtMDUKLSDsg4Htg5w6IFBST1BPU0VEX0ZPUl9BUFBST1ZBTAoKIyMgRDAwLTAxCgrtlITroZzsoJ3tirjsnZgg7KCV7IudIOuqhey5reydgCBgQUkg7ZSE66Gc7KCd7Yq4IOq1kOycoSDthrXtlakg7ZSE66CI7J6E7JuM7YGsYOuhnCDtlZzri6QuCgojIyBEMDAtMDIKCuygleyLnSDtlITroZzsoJ3tirggSUQsIOuhnOy7rCDtj7TrjZTsmYAgR2l0SHViIOyggOyepeyGjCDsnbTrpoTsnYAg66qo65GQIGBhaS1wcm9qZWN0LWVkdWNhdGlvbmDsnLzroZwg7Ya17J287ZWc64ukLgoKIyMgRDAwLTAzCgrrs4Trj4TsnZggYm9vdHN0cmFwLCBwYWNrYWdlIOuYkOuKlCDsnoTsi5wg7ZSE66Gc7KCd7Yq4IO2PtOuNlOulvCDrkZDsp4Ag7JWK64qU64ukLgoKIyMgRDAwLTA0Cgrrqqjrk6Ag6rWQ7Jyh6rO87KCVLCDtj6zthLgsIFNraWxsLCDsmIjsi5wsIO2FnO2UjOumvywg7Y+J6rCA7ZGc7JmAIOyatOyYgeusuOyEnOuKlCDtlZjrgpjsnZggR2l0SHViIOyggOyepeyGjOyXkOyEnCDqtIDrpqztlZzri6QuCgojIyBEMDAtMDUKCuugiOuyqOuzhCDqtZDsnKHsnpDro4zripQg64+F66a9IOybueyCrOydtO2KuOuCmCDrs4Trj4Qg7KCA7J6l7IaM66GcIOu2hOumrO2VmOyngCDslYrqs6Ag64uo7J28IO2PrO2EuOydmCDrqqjrk4jroZwg7ZmV7J6l7ZWc64ukLgoKIyMgRDAwLTA2CgrroZzsu6wg7J6R7JeF6rO8IOy0iOq4sO2ZlMK36rKA7KadwrfrsLDtj6wg64+E6rWs64qUIFdpbmRvd3MgUG93ZXJTaGVsbOydhCDquLDspIDsnLzroZwg7ZWc64ukLgoKIyMgRDAwLTA3Cgrqs7Xsi50g7JuQ67O47J2AIEdpdEh1YiBgbWFpbmAg67iM656c7LmY7J2066mwLCDsoJXsoIEg7Y+s7YS47J2AIEdpdEh1YiBQYWdlc+uhnCDrsLDtj6ztlZzri6QuCgojIyBEMDAtMDgKCu2UhOuhnOygne2KuCDstpTsp4TsnYAgU1RBR0UgMDDrtoDthLAgU1RBR0UgMDfquYzsp4Ag64uo6rOE67OEIOusuOyEnCwg6rKw7KCVIOq4sOuhneqzvCDtlbjrk5zsmKTtlITroZwg6rSA66as7ZWc64ukLgo="

Write-Base64File `
    -Path (Join-Path $resolvedRoot "skills\ai-project-education\SKILL.md") `
    -Base64 "77u/LS0tCm5hbWU6IGFpLXByb2plY3QtZWR1Y2F0aW9uCmRlc2NyaXB0aW9uOiBEZXNpZ24sIHRlYWNoLCB2YWxpZGF0ZSwgcHVibGlzaCwgYW5kIGltcHJvdmUgc3RydWN0dXJlZCBBSSBwcm9qZWN0IGVkdWNhdGlvbiB1c2luZyBhIHNoYXJlZCBsaWZlY3ljbGUgYW5kIHJldXNhYmxlIGxlYXJuaW5nIGFzc2V0cy4KLS0tCgojIEFJIFByb2plY3QgRWR1Y2F0aW9uCgpVc2UgdGhpcyBza2lsbCB3aGVuIGRlc2lnbmluZyBvciBydW5uaW5nIGVkdWNhdGlvbiB0aGF0IHVzZXMgQUkgdG8gY29sbGVjdCwgYW5hbHl6ZSwgYnVpbGQsIHZhbGlkYXRlLCBhbmQgcHVibGlzaCByZWFsIHByb2plY3Qgb3V0Y29tZXMuCgojIyBMaWZlY3ljbGUKCjEuIERFRklORQoyLiBDT0xMRUNUCjMuIFNUUlVDVFVSRQo0LiBCVUlMRAo1LiBURVNUCjYuIFBVQkxJU0gKNy4gSU1QUk9WRQoKIyMgUnVsZXMKCi0gRG8gbm90IHJlZHVjZSB0aGUgYWN0aXZpdHkgdG8gb25lLXNob3QgcHJvbXB0aW5nLgotIExlYXZlIGEgdmlzaWJsZSBhcnRpZmFjdCBhdCBldmVyeSBzdGFnZS4KLSBVc2UgY2hhdC1iYXNlZCBBSSBhcyB0aGUgbGVhcm5lciBkZWZhdWx0LgotIFRyZWF0IGNvZGluZyBhZ2VudHMgYW5kIE1DUCBhcyBvcHRpb25hbCBleHRlbnNpb25zLgotIFJldXNlIHNoYXJlZCB0ZW1wbGF0ZXMsIGV4YW1wbGVzLCBhbmQgcnVicmljcy4KLSBWYWxpZGF0ZSBiZWZvcmUgcHVibGlzaGluZy4K"

Write-Base64File `
    -Path (Join-Path $resolvedRoot "portal\index.html") `
    -Base64 "77u/PCFkb2N0eXBlIGh0bWw+CjxodG1sIGxhbmc9ImtvIj4KPGhlYWQ+CiAgPG1ldGEgY2hhcnNldD0idXRmLTgiPgogIDxtZXRhIG5hbWU9InZpZXdwb3J0IiBjb250ZW50PSJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MSI+CiAgPHRpdGxlPkFJIO2UhOuhnOygne2KuCDqtZDsnKEg7Ya17ZWpIO2UhOugiOyehOybjO2BrDwvdGl0bGU+CiAgPGxpbmsgcmVsPSJzdHlsZXNoZWV0IiBocmVmPSIuL2Fzc2V0cy9zdHlsZXMuY3NzIj4KPC9oZWFkPgo8Ym9keT4KICA8bWFpbiBjbGFzcz0ic2hlbGwiPgogICAgPHAgY2xhc3M9ImV5ZWJyb3ciPkFJIFBST0pFQ1QgRURVQ0FUSU9OIEZSQU1FV09SSzwvcD4KICAgIDxoMT5BSeulvCDqsrDqs7zrrLzsnbQg7JWE64uMIO2UhOuhnOygne2KuCDqs7zsoJXsnLzroZwg67Cw7JuB64uI64ukLjwvaDE+CiAgICA8cCBjbGFzcz0ibGVhZCI+7J6Q66OMIOyImOynkeu2gO2EsCDrtoTshJ0sIOygnOyekSwg6rKA7KadLCDrsLDtj6zquYzsp4Ag7ZWY64KY7J2YIOqzte2GtSDtnZDrpoTsnLzroZwg7Jew6rKw7ZWY64qUIO2Gte2VqSDqtZDsnKHtj6zthLjsnoXri4jri6QuPC9wPgogICAgPHNlY3Rpb24gY2xhc3M9ImxpZmVjeWNsZSIgYXJpYS1sYWJlbD0i7ZSE66Gc7KCd7Yq4IOyDneuqheyjvOq4sCI+CiAgICAgIDxzcGFuPkRFRklORTwvc3Bhbj48c3Bhbj5DT0xMRUNUPC9zcGFuPjxzcGFuPlNUUlVDVFVSRTwvc3Bhbj4KICAgICAgPHNwYW4+QlVJTEQ8L3NwYW4+PHNwYW4+VEVTVDwvc3Bhbj48c3Bhbj5QVUJMSVNIPC9zcGFuPjxzcGFuPklNUFJPVkU8L3NwYW4+CiAgICA8L3NlY3Rpb24+CiAgICA8c2VjdGlvbiBjbGFzcz0ibGV2ZWxzIj4KICAgICAgPGFydGljbGU+PHN0cm9uZz5MRVZFTCAxPC9zdHJvbmc+PHA+M+yLnOqwhCDssYTtjIXtmJUg66+464uIIOyXkOydtOyghO2KuDwvcD48L2FydGljbGU+CiAgICAgIDxhcnRpY2xlPjxzdHJvbmc+TEVWRUwgMjwvc3Ryb25nPjxwPjR+NuyLnOqwhCDrsLDtj6ztmJUg7Ju5IOyXkOydtOyghO2KuDwvcD48L2FydGljbGU+CiAgICAgIDxhcnRpY2xlPjxzdHJvbmc+TEVWRUwgMzwvc3Ryb25nPjxwPuyekOujjCDsl7DqsrDtmJUg7JeQ7J207KCE7Yq4PC9wPjwvYXJ0aWNsZT4KICAgICAgPGFydGljbGU+PHN0cm9uZz5MRVZFTCA0PC9zdHJvbmc+PHA+7Jq07JiB7ZiVIOyepeq4sCDtlITroZzsoJ3tirg8L3A+PC9hcnRpY2xlPgogICAgPC9zZWN0aW9uPgogICAgPHAgY2xhc3M9InN0YXR1cyI+7ZiE7J6sIOuLqOqzhDogU1RBR0UgMDAg7Ya17ZWpIOq4sOuwmCDshKTqs4Q8L3A+CiAgPC9tYWluPgo8L2JvZHk+CjwvaHRtbD4K"

Write-AsciiFile `
    -Path (Join-Path $resolvedRoot "portal\assets\styles.css") `
    -Content "* { box-sizing: border-box; }`r`n:root { font-family: Arial, `"Malgun Gothic`", sans-serif; line-height: 1.55; }`r`nbody { margin: 0; background: #f4f6f8; color: #17212b; }`r`n.shell { width: min(1100px, calc(100% - 32px)); margin: 8vh auto; padding: 48px; background: #fff; border: 1px solid #d7dee5; border-radius: 24px; }`r`n.eyebrow { font-size: .78rem; font-weight: 800; letter-spacing: .16em; }`r`nh1 { max-width: 850px; margin: 20px 0; font-size: clamp(2rem, 6vw, 4.5rem); line-height: 1.08; }`r`n.lead { max-width: 760px; font-size: 1.15rem; }`r`n.lifecycle { display: flex; flex-wrap: wrap; gap: 8px; margin: 36px 0; }`r`n.lifecycle span { padding: 9px 13px; border: 1px solid #aeb9c4; border-radius: 999px; font-size: .78rem; font-weight: 700; }`r`n.levels { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; }`r`n.levels article { padding: 20px; border: 1px solid #d7dee5; border-radius: 16px; }`r`n.levels p { margin-bottom: 0; }`r`n.status { margin-top: 28px; font-weight: 700; }`r`n"

Write-AsciiFile `
    -Path (Join-Path $resolvedRoot ".github\workflows\deploy-pages.yml") `
    -Content "name: Deploy education portal`r`n`r`non:`r`n  push:`r`n    branches:`r`n      - main`r`n    paths:`r`n      - `"portal/**`"`r`n      - `".github/workflows/deploy-pages.yml`"`r`n  workflow_dispatch:`r`n`r`npermissions:`r`n  contents: read`r`n  pages: write`r`n  id-token: write`r`n`r`nconcurrency:`r`n  group: pages`r`n  cancel-in-progress: true`r`n`r`njobs:`r`n  deploy:`r`n    environment:`r`n      name: github-pages`r`n      url: `${{ steps.deployment.outputs.page_url }}`r`n    runs-on: ubuntu-latest`r`n    steps:`r`n      - name: Checkout`r`n        uses: actions/checkout@v6`r`n`r`n      - name: Configure Pages`r`n        uses: actions/configure-pages@v5`r`n`r`n      - name: Upload portal`r`n        uses: actions/upload-pages-artifact@v4`r`n        with:`r`n          path: ./portal`r`n`r`n      - name: Deploy`r`n        id: deployment`r`n        uses: actions/deploy-pages@v4`r`n"

Write-AsciiFile `
    -Path (Join-Path $resolvedRoot ".gitignore") `
    -Content ".env`r`n.env.*`r`n!.env.example`r`nnode_modules/`r`ndist/`r`nbuild/`r`n.cache/`r`n.temp/`r`ntmp/`r`n*.log`r`n*.zip`r`n.DS_Store`r`nThumbs.db`r`n.vscode/`r`n.idea/`r`n"

Write-AsciiFile `
    -Path (Join-Path $resolvedRoot ".gitattributes") `
    -Content "* text=auto`r`n*.ps1 text eol=crlf`r`n*.md text eol=lf`r`n*.yml text eol=lf`r`n*.yaml text eol=lf`r`n*.html text eol=lf`r`n*.css text eol=lf`r`n*.js text eol=lf`r`n"

Write-AsciiFile `
    -Path (Join-Path $resolvedRoot "LICENSE") `
    -Content "MIT License`r`n`r`nCopyright (c) 2026 teacher invent`r`n`r`nPermission is hereby granted, free of charge, to any person obtaining a copy`r`nof this software and associated documentation files to deal in the Software`r`nwithout restriction, including without limitation the rights to use, copy,`r`nmodify, merge, publish, distribute, sublicense, and sell copies of the`r`nSoftware, subject to the following conditions:`r`n`r`nThe above copyright notice and this permission notice shall be included in`r`nall copies or substantial portions of the Software.`r`n`r`nTHE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND.`r`n"

foreach ($relativePath in $directories) {
    $folder = Join-Path $resolvedRoot $relativePath
    $items = @(Get-ChildItem -LiteralPath $folder -Force)
    if ($items.Count -eq 0) {
        Write-AsciiFile `
            -Path (Join-Path $folder ".gitkeep") `
            -Content ""
    }
}

Write-Step "Initialize the local Git repository"

Push-Location $resolvedRoot
try {
    Invoke-Git -Arguments @("init")
    Invoke-Git -Arguments @("branch", "-M", "main")

    $gitName = (& git config user.name)
    $gitEmail = (& git config user.email)

    if ([string]::IsNullOrWhiteSpace($gitName)) {
        $gitName = Read-Host "Enter Git user name"
        Invoke-Git -Arguments @("config", "user.name", $gitName)
    }

    if ([string]::IsNullOrWhiteSpace($gitEmail)) {
        $gitEmail = Read-Host "Enter Git email"
        Invoke-Git -Arguments @("config", "user.email", $gitEmail)
    }

    Invoke-Git -Arguments @("add", ".")
    Invoke-Git -Arguments @(
        "commit",
        "-m",
        "chore: initialize integrated AI education framework"
    )

    Write-Step "Create the GitHub repository and push main"

    Invoke-Gh -Arguments @(
        "repo",
        "create",
        $fullName,
        ("--" + $Visibility),
        "--source",
        $resolvedRoot,
        "--remote",
        "origin",
        "--push",
        "--description",
        "Integrated framework for structured AI project education"
    )

    Write-Step "Enable GitHub Pages"

    & gh api `
        --method POST `
        ("repos/" + $fullName + "/pages") `
        -f "build_type=workflow"

    if ($LASTEXITCODE -ne 0) {
        throw @"
GitHub Pages setup failed.

Open:
https://github.com/foruniquelife00/ai-project-education/settings/pages

Select:
Build and deployment -> Source -> GitHub Actions
"@
    }

    Invoke-Gh -Arguments @(
        "workflow",
        "run",
        "deploy-pages.yml",
        "--repo",
        $fullName
    )
}
finally {
    Pop-Location
}

Write-Step "Initialization completed"

Write-Host ("Project root: " + $resolvedRoot)
Write-Host ("GitHub: https://github.com/" + $fullName)
Write-Host ("Portal: https://" + $GitHubOwner + ".github.io/" + $RepositoryName + "/")
Write-Host ""
Write-Host "Next command:"
Write-Host ("Set-Location " + $resolvedRoot)
Write-Host ("gh run list --repo " + $fullName)
