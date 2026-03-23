# Create index.html by extracting body from dulces_creaciones_v2.html
# and replacing the inline style with external CSS/JS references
$lines = Get-Content 'dulces_creaciones_v2.html' -Encoding UTF8

# Head section: lines 1-12 (0-indexed: 0..11)
# Body: lines 182-end (0-indexed: 181..)
# We need to construct a new HTML with:
# 1. Same head but add <link> to styles.css instead of <style>...</style>
# 2. Add hamburger button to nav
# 3. Add <script src="scripts.js"> at bottom

$headLines = $lines[0..11]
$bodyEnd = $lines.Count - 1
$bodyLines = $lines[181..$bodyEnd]

# Build new HTML
$newHtml = @()

# Add head lines
foreach ($line in $headLines) {
    $newHtml += $line
}

# Add CSS link
$newHtml += '<link rel="stylesheet" href="styles.css"/>'
$newHtml += '</head>'

# Process body lines to insert hamburger button after nav opening
$navProcessed = $false
foreach ($line in $bodyLines) {
    if (-not $navProcessed -and $line -match '</ul>') {
        # Add the hamburger button before closing </nav>
        $newHtml += $line
    }
    elseif (-not $navProcessed -and $line -match '<nav id="navbar">') {
        # Add hamburger button right after nav opening line  
        $newHtml += $line
        # We'll add hamburger after the nav-logo link
    }
    elseif (-not $navProcessed -and $line -match '</nav>') {
        # Insert hamburger button before </nav>
        $newHtml += '  <button class="hamburger" aria-label="Menú"><span></span><span></span><span></span></button>'
        $newHtml += $line
        $navProcessed = $true
    }
    elseif ($line -match '</body>') {
        # Add script before closing body
        $newHtml += '<script src="scripts.js"></script>'
        $newHtml += $line
    }
    else {
        $newHtml += $line
    }
}

# Write new index.html
$newHtml -join "`n" | Set-Content -Path 'index.html' -Encoding UTF8 -NoNewline
Write-Host ("index.html created with " + $newHtml.Count + " lines")
Write-Host "File size: $((Get-Item 'index.html').Length) bytes"
Write-Host "Original file size: $((Get-Item 'dulces_creaciones_v2.html').Length) bytes"
