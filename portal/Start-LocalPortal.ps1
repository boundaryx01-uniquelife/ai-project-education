param(
    [int]$Port = 8080
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$PortalRoot = $PSScriptRoot
$Prefix = "http://127.0.0.1:$Port/"
$MimeTypes = @{
    ".css" = "text/css; charset=utf-8"
    ".html" = "text/html; charset=utf-8"
    ".js" = "text/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg" = "image/svg+xml"
}

$Listener = [System.Net.HttpListener]::new()
$Listener.Prefixes.Add($Prefix)

try {
    $Listener.Start()
    Write-Host "LEVEL 1 portal is running at $Prefix"
    Write-Host "Press Ctrl+C to stop the local portal."
    while ($Listener.IsListening) {
        $Context = $Listener.GetContext()
        $RelativePath = [Uri]::UnescapeDataString($Context.Request.Url.AbsolutePath.TrimStart('/'))
        if ([string]::IsNullOrWhiteSpace($RelativePath)) { $RelativePath = "index.html" }
        $Candidate = [IO.Path]::GetFullPath((Join-Path $PortalRoot $RelativePath))
        if (Test-Path -LiteralPath $Candidate -PathType Container) {
            $Candidate = Join-Path $Candidate "index.html"
        }
        if (-not $Candidate.StartsWith($PortalRoot, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path -LiteralPath $Candidate -PathType Leaf)) {
            $Context.Response.StatusCode = 404
            $Context.Response.Close()
            continue
        }
        $Extension = [IO.Path]::GetExtension($Candidate).ToLowerInvariant()
        $Context.Response.ContentType = if ($MimeTypes.ContainsKey($Extension)) { $MimeTypes[$Extension] } else { "application/octet-stream" }
        $Bytes = [IO.File]::ReadAllBytes($Candidate)
        $Context.Response.ContentLength64 = $Bytes.Length
        $Context.Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
        $Context.Response.Close()
    }
}
finally {
    if ($Listener.IsListening) { $Listener.Stop() }
    $Listener.Close()
}
