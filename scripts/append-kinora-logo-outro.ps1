# Append a 2.00s Kinora logo end-card to every clinical-test mp4.
# Demo is fit to 8.00s (trim or freeze last frame) so every file is 10.00s total.
# Re-runs always encode from .pre-logo-backup so the logo is never stacked twice.
# Usage:
#   powershell -File scripts/append-kinora-logo-outro.ps1
#   powershell -File scripts/append-kinora-logo-outro.ps1 -Only lachman.mp4

param(
  [string]$Only = ""
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$videosDir = Join-Path $root "public\clinical-tests\videos"
$backupDir = Join-Path $videosDir ".pre-logo-backup"
$logoPng = Join-Path $root "public\logo-icon.png"
$logoSeconds = 2.00
$clipSeconds = 8.00
$totalSeconds = $clipSeconds + $logoSeconds

if (-not (Test-Path $logoPng)) { throw "Missing logo: $logoPng" }
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

Get-ChildItem -Path $videosDir -Filter "*.mp4" | ForEach-Object {
  $dest = Join-Path $backupDir $_.Name
  if (-not (Test-Path $dest)) {
    Copy-Item $_.FullName $dest
  }
}

$files = Get-ChildItem -Path $backupDir -Filter "*.mp4"
if ($Only) {
  $files = $files | Where-Object { $_.Name -eq $Only }
  if (-not $files) { throw "No backup match for $Only" }
}

function Get-VideoMeta([string]$path) {
  $raw = ffprobe -v error -select_streams v:0 -show_entries stream=width,height -show_entries format=duration -of json $path
  $j = $raw | ConvertFrom-Json
  return [pscustomobject]@{
    Width    = [int]$j.streams[0].width
    Height   = [int]$j.streams[0].height
    Duration = [double]$j.format.duration
  }
}

$ok = 0
$fail = 0
foreach ($src in $files) {
  $name = $src.Name
  $out = Join-Path $videosDir $name
  $tmp = Join-Path $videosDir (".$name.logo-tmp.mp4")
  $meta = Get-VideoMeta $src.FullName
  $w = $meta.Width
  $h = $meta.Height
  $logoPx = [int][math]::Round([math]::Min($w, $h) * 0.55)
  Write-Host ("{0,-28} {1}x{2}  src {3:n2}s → {4:n2}s clip + {5:n2}s logo = {6:n2}s" -f $name, $w, $h, $meta.Duration, $clipSeconds, $logoSeconds, $totalSeconds)

  $fc = @"
[0:v]fps=24,format=yuv420p,trim=duration=${clipSeconds},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop=-1,trim=duration=${clipSeconds},setpts=PTS-STARTPTS[mainv];
[1:v]fps=24,scale=${logoPx}:${logoPx}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2:white,format=yuv420p,trim=duration=${logoSeconds},setpts=PTS-STARTPTS[logov];
[mainv][logov]concat=n=2:v=1:a=0[v]
"@ -replace "`r`n", ""

  $args = @(
    "-y",
    "-i", $src.FullName,
    "-loop", "1", "-t", "$logoSeconds", "-i", $logoPng,
    "-f", "lavfi", "-t", ("{0:n3}" -f $totalSeconds), "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
    "-filter_complex", $fc,
    "-map", "[v]", "-map", "2:a",
    "-c:v", "libx264", "-profile:v", "main", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "96k",
    "-movflags", "+faststart",
    "-t", ("{0:n3}" -f $totalSeconds),
    $tmp
  )

  & ffmpeg -hide_banner -loglevel error @args
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path $tmp)) {
    Write-Host "  FAIL $name"
    $fail++
    if (Test-Path $tmp) { Remove-Item $tmp -Force }
    continue
  }
  Move-Item -Force $tmp $out
  $ok++
}

Write-Host "Done. ok=$ok fail=$fail clip=${clipSeconds}s logo=${logoSeconds}s total=${totalSeconds}s"
if ($fail -gt 0) { exit 1 }
