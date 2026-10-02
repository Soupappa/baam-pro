param(
  [Parameter(Mandatory = $true)][string]$Source,
  [Parameter(Mandatory = $true)][string]$Destination,
  [int]$FrameStep = 5,
  [int]$PointStep = 2
)

function Compress-Path([string]$PathData) {
  $points = [regex]::Matches($PathData, '([ML])\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)')
  if ($points.Count -lt 3) { return $PathData }

  $selected = [System.Collections.Generic.List[string]]::new()
  for ($index = 0; $index -lt $points.Count; $index += $PointStep) {
    $point = $points[$index]
    $command = if ($selected.Count -eq 0) { 'M' } else { 'L' }
    $selected.Add("$command$($point.Groups[2].Value) $($point.Groups[3].Value)")
  }

  if (($points.Count - 1) % $PointStep -ne 0) {
    $point = $points[$points.Count - 1]
    $selected.Add("L$($point.Groups[2].Value) $($point.Groups[3].Value)")
  }

  return $selected -join ' '
}

$sourceText = [IO.File]::ReadAllText($Source)

$sourceText = [regex]::Replace($sourceText, 'd="([^"]+)"', {
  param($match)
  'd="' + (Compress-Path $match.Groups[1].Value) + '"'
})

$sourceText = [regex]::Replace($sourceText, 'values="([^"]+)"', {
  param($match)
  $frames = $match.Groups[1].Value.Split(';')
  $selectedFrames = [System.Collections.Generic.List[string]]::new()
  for ($index = 0; $index -lt $frames.Count; $index += $FrameStep) {
    $selectedFrames.Add((Compress-Path $frames[$index]))
  }
  if (($frames.Count - 1) % $FrameStep -ne 0) {
    $selectedFrames.Add((Compress-Path $frames[$frames.Count - 1]))
  }
  'values="' + ($selectedFrames -join ';') + '"'
})

[IO.File]::WriteAllText($Destination, $sourceText, [Text.UTF8Encoding]::new($false))
