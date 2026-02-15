Add-Type -AssemblyName System.Drawing
$path = "c:\Users\User\Desktop\MojKutakWeb\moj-kutak-web\public\logo2.png"
if (-not (Test-Path $path)) { Write-Error "File not found: $path"; exit }

try {
    $img = [System.Drawing.Bitmap]::FromFile($path)
    $colors = @{}
    
    # Adaptive step size based on dimensions
    $stepX = [math]::Max(1, [math]::Round($img.Width / 50))
    $stepY = [math]::Max(1, [math]::Round($img.Height / 50))

    for($x=0; $x -lt $img.Width; $x+=$stepX) {
        for($y=0; $y -lt $img.Height; $y+=$stepY) {
            $p = $img.GetPixel($x, $y)
            if ($p.A -gt 200) {
                # Quantize to reduce noise (group similar colors)
                $r = [math]::Round($p.R / 20) * 20
                $g = [math]::Round($p.G / 20) * 20
                $b = [math]::Round($p.B / 20) * 20
                $key = "$r,$g,$b"
                if ($colors.ContainsKey($key)) { $colors[$key]++ } else { $colors[$key] = 1 }
            }
        }
    }

    $sorted = $colors.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 5
    foreach ($c in $sorted) {
        Write-Output "ColorRGB: $($c.Key) Count: $($c.Value)"
    }
    $img.Dispose()
} catch {
    Write-Error "Error pprocessing image: $_"
}
