# Automated Test Suite for Phase 3: Map Interaction & 5-Tab Detail Panel (VN34MG)
$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   VN34MG AUTOMATED TEST SUITE - PHASE 3 (INTERACTION & 5 TABS) " -ForegroundColor Cyan
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

# Test 1: Check Mode Switcher in VietnamMap.tsx
$mapFile = "C:\Users\adm\Downloads\web34\frontend\components\map\VietnamMap.tsx"
Assert-Test "T3.1.1: VietnamMap.tsx exists" (Test-Path $mapFile)
if (Test-Path $mapFile) {
    $mapContent = Get-Content $mapFile -Raw -Encoding UTF8
    Assert-Test "T3.1.2: Exact mode text 'Kinh tế - Xã hội (6 vùng)' is used" ($mapContent -match 'Kinh tế - Xã hội \(6 vùng\)')
    Assert-Test "T3.1.3: Mode 'Tự nhiên (7 khu vực)' is used" ($mapContent -match 'Tự nhiên \(7 khu vực\)')
    Assert-Test "T3.1.4: Mode 'Hành chính (34 tỉnh)' is used" ($mapContent -match 'Hành chính \(34 tỉnh\)')
    Assert-Test "T3.1.5: Tooltip S1 with hover details exists" ($mapContent -match 'hoveredProvince' -and $mapContent -match 'tooltipPos')
    Assert-Test "T3.1.6: Region highlighting support (selectedRegionId, hoveredRegionId) exists" ($mapContent -match 'selectedRegionId' -and $mapContent -match 'hoveredRegionId')
}

# Test 2: Check Smart Region Cards Strip (RegionCardsStrip.tsx)
$stripFile = "C:\Users\adm\Downloads\web34\frontend\components\map\RegionCardsStrip.tsx"
Assert-Test "T3.2.1: RegionCardsStrip.tsx exists" (Test-Path $stripFile)
if (Test-Path $stripFile) {
    $stripContent = Get-Content $stripFile -Raw -Encoding UTF8
    Assert-Test "T3.2.2: Adaptive positioning (vertical when closed, horizontal when open) exists" ($stripContent -match 'isDetailPanelOpen' -and $stripContent -match 'bottom-4' -and $stripContent -match 'top-20')
    Assert-Test "T3.2.3: Supports 6 Economic Regions and 7 Natural Regions" ($stripContent -match 'ECONOMIC_REGIONS' -and $stripContent -match 'NATURAL_REGIONS')
    Assert-Test "T3.2.4: Region card hover and select handlers exist" ($stripContent -match 'onSelectRegion' -and $stripContent -match 'onHoverRegion')
}

# Test 3: Check 5-Tab Province Detail Panel (ProvinceDetailPanel.tsx)
$panelFile = "C:\Users\adm\Downloads\web34\frontend\components\panels\ProvinceDetailPanel.tsx"
Assert-Test "T3.3.1: ProvinceDetailPanel.tsx exists" (Test-Path $panelFile)
if (Test-Path $panelFile) {
    $panelContent = Get-Content $panelFile -Raw -Encoding UTF8
    Assert-Test "T3.3.2: 5 tabs exist (Tổng quan, Tự nhiên, Kinh tế, Hình ảnh, Nguồn)" ($panelContent -match 'overview' -and $panelContent -match 'nature' -and $panelContent -match 'economy' -and $panelContent -match 'images' -and $panelContent -match 'sources')
    Assert-Test "T3.3.3: Sovereignty note for Hoang Sa & Truong Sa is present" ($panelContent -match 'CHỦ QUYỀN BIỂN ĐẢO THIÊNG LIÊNG' -or $panelContent -match 'sovereigntyNote')
    Assert-Test "T3.3.4: Economic structure progress bar exists" ($panelContent -match 'detail.economy.structure.agriculture' -and $panelContent -match 'detail.economy.structure.industry')
    Assert-Test "T3.3.5: Verified sources tab with verification badge exists" ($panelContent -match 'Đã kiểm chứng' -and $panelContent -match 'detail.sources')
}

# Test 4: Check Province Data & Types
$dataFile = "C:\Users\adm\Downloads\web34\frontend\data\provinces-detail-data.ts"
$detailsTypeFile = "C:\Users\adm\Downloads\web34\frontend\types\province-details.ts"
Assert-Test "T3.4.1: provinces-detail-data.ts exists" (Test-Path $dataFile)
Assert-Test "T3.4.2: province-details.ts type definition exists" (Test-Path $detailsTypeFile)
if (Test-Path $dataFile) {
    $dataContent = Get-Content $dataFile -Raw -Encoding UTF8
    Assert-Test "T3.4.3: Da Nang includes Hoang Sa sovereignty" ($dataContent -match 'Hoàng Sa' -and $dataContent -match 'VN48')
    Assert-Test "T3.4.4: Khanh Hoa includes Truong Sa sovereignty" ($dataContent -match 'Trường Sa' -and $dataContent -match 'VN56')
    Assert-Test "T3.4.5: Dynamic generator getCompleteProvinceDetail is defined" ($dataContent -match 'getCompleteProvinceDetail')
}

Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
Write-Host "TOTAL TESTS: $($passed + $failed) | PASSED: $passed | FAILED: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================================" -ForegroundColor Cyan

if ($failed -gt 0) { exit 1 } else { exit 0 }
