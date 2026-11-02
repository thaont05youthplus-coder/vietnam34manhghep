# Automated Test Suite for Phase 1: GIS Data Processing & Core 2D Map (VN34MG)
$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   VN34MG AUTOMATED TEST SUITE - PHASE 1 (GIS & CORE MAP) " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$passed = 0
$failed = 0

function Assert-Test($name, $condition) {
    if ($condition) {
        Write-Host " [PASS] $name" -ForegroundColor Green
        $script:passed++
    } else {
        Write-Host " [FAIL] $name" -ForegroundColor Red
        $script:failed++
    }
}

# Test 1: GeoJSON file existence & size optimization
$geoJsonPath = "C:\Users\adm\Downloads\web34\frontend\public\data\vietnam_34_provinces.geojson"
Assert-Test "T01.1: Optimized GeoJSON file exists" (Test-Path $geoJsonPath)

if (Test-Path $geoJsonPath) {
    $fileInfo = Get-Item $geoJsonPath
    $fileSizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
    Assert-Test "T01.2: GeoJSON size ($fileSizeMB MB) is under 3MB target" ($fileInfo.Length -lt 3MB)

    # Use Node to accurately inspect GeoJSON
    $nodeInspect = & "C:\Program Files\nodejs\node.exe" -e "
        const fs = require('fs');
        let content = fs.readFileSync('$($geoJsonPath.Replace('\', '/'))', 'utf-8');
        if (content.charCodeAt(0) === 0xfeff) content = content.substring(1);
        const data = JSON.parse(content);
        const count = data.features.length;
        const daNang = data.features.find(f => f.properties.name === 'Đà Nẵng' || f.properties.provinceCode === 'VN48');
        const khanhHoa = data.features.find(f => f.properties.name === 'Khánh Hòa' || f.properties.provinceCode === 'VN56');
        
        let hsCoords = 0;
        let tsCoords = 0;
        if (daNang) {
            for (const poly of daNang.geometry.coordinates) {
                for (const ring of poly) {
                    for (const pt of ring) {
                        if (pt[0] >= 111 && pt[0] <= 113.5 && pt[1] >= 15.5 && pt[1] <= 17.5) hsCoords++;
                    }
                }
            }
        }
        if (khanhHoa) {
            for (const poly of khanhHoa.geometry.coordinates) {
                for (const ring of poly) {
                    for (const pt of ring) {
                        if (pt[0] >= 111.5 && pt[0] <= 118 && pt[1] >= 6 && pt[1] <= 12.5) tsCoords++;
                    }
                }
            }
        }
        console.log(JSON.stringify({
            count,
            hasDaNang: !!daNang,
            hasKhanhHoa: !!khanhHoa,
            hsCoords,
            tsCoords
        }));
    " | ConvertFrom-Json

    Assert-Test "T01.3: Contains exactly 34 province features (found: $($nodeInspect.count))" ($nodeInspect.count -eq 34)
    Assert-Test "T02.1: Da Nang feature exists" ($nodeInspect.hasDaNang -eq $true)
    Assert-Test "T02.2: Khanh Hoa feature exists" ($nodeInspect.hasKhanhHoa -eq $true)
    Assert-Test "T02.3: Da Nang includes Hoang Sa archipelago coordinates ($($nodeInspect.hsCoords) pts preserved)" ($nodeInspect.hsCoords -gt 100)
    Assert-Test "T02.4: Khanh Hoa includes Truong Sa archipelago coordinates ($($nodeInspect.tsCoords) pts preserved)" ($nodeInspect.tsCoords -gt 100)
}

# Test 3: Components verification
$mapComp = "C:\Users\adm\Downloads\web34\frontend\components\map\VietnamMap.tsx"
$insetComp = "C:\Users\adm\Downloads\web34\frontend\components\map\InsetMap.tsx"

Assert-Test "T03.1: VietnamMap.tsx component exists" (Test-Path $mapComp)
Assert-Test "T03.2: InsetMap.tsx component exists" (Test-Path $insetComp)

if (Test-Path $mapComp) {
    $mapText = Get-Content $mapComp -Raw -Encoding UTF8
    Assert-Test "T03.3: Map strictly uses neutral vector without global raster tiles" ($mapText -notmatch 'openstreetmap.org' -and $mapText -notmatch 'tile.openstreetmap')
    Assert-Test "T03.4: Map contains Hoang Sa and Truong Sa sovereignty representation" ($mapText -match 'HO.*NG SA' -and $mapText -match 'TR.*NG SA')
}

Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
Write-Host "TOTAL TESTS: $($passed + $failed) | PASSED: $passed | FAILED: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================================" -ForegroundColor Cyan

if ($failed -gt 0) { exit 1 } else { exit 0 }
