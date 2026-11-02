# Automated Test Suite for Phase 2: Workspace Layout & Window Manager (VN34MG)
$ErrorActionPreference = "Continue"

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "   VN34MG AUTOMATED TEST SUITE - PHASE 2 (WORKSPACE) " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

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

# Test 1: Check Header component file & 68px height requirement
$headerFile = "C:\Users\adm\Downloads\web34\frontend\components\layout\Header.tsx"
Assert-Test "T2.1.1: Header.tsx exists" (Test-Path $headerFile)
if (Test-Path $headerFile) {
    $headerContent = Get-Content $headerFile -Raw -Encoding UTF8
    Assert-Test "T2.1.2: Header specifies 68px height (h-[68px]) per Spec" ($headerContent -match 'h-\[68px\]')
    Assert-Test "T2.1.3: Header includes search input and autocomplete" ($headerContent -match 'filteredProvinces' -and $headerContent -match 'inputRef')
    Assert-Test "T2.1.4: Header includes archipelago sovereignty status" ($headerContent -match 'Hoàng Sa' -and $headerContent -match 'Trường Sa')
    Assert-Test "T2.1.5: Header includes Reset Layout button" ($headerContent -match 'onResetLayout')
}

# Test 2: Check Sidebar component file & 4 tool buttons
$sidebarFile = "C:\Users\adm\Downloads\web34\frontend\components\layout\Sidebar.tsx"
Assert-Test "T2.2.1: Sidebar.tsx exists" (Test-Path $sidebarFile)
if (Test-Path $sidebarFile) {
    $sidebarContent = Get-Content $sidebarFile -Raw -Encoding UTF8
    Assert-Test "T2.2.2: Sidebar supports collapsible widths (w-64 vs w-16)" ($sidebarContent -match 'w-64' -and $sidebarContent -match 'w-16')
    Assert-Test "T2.2.3: Tool 1 Chatbox AI is defined" ($sidebarContent -match 'Chatbox')
    Assert-Test "T2.2.4: Tool 2 Question Bank is defined" ($sidebarContent -match 'questions' -and $sidebarContent -match '5 Cấp')
    Assert-Test "T2.2.5: Tool 3 Dual Notes is defined" ($sidebarContent -match 'notes' -and $sidebarContent -match 'Canvas')
    Assert-Test "T2.2.6: Tool 4 Study Quizlet-style is defined" ($sidebarContent -match 'study' -and $sidebarContent -match 'Quizlet')
}

# Test 3: Check WindowFrame & WindowManager
$windowFrameFile = "C:\Users\adm\Downloads\web34\frontend\components\workspace\WindowFrame.tsx"
$windowManagerFile = "C:\Users\adm\Downloads\web34\frontend\components\workspace\WindowManager.tsx"
Assert-Test "T2.3.1: WindowFrame.tsx exists" (Test-Path $windowFrameFile)
Assert-Test "T2.3.2: WindowManager.tsx exists" (Test-Path $windowManagerFile)

if (Test-Path $windowFrameFile) {
    $frameContent = Get-Content $windowFrameFile -Raw -Encoding UTF8
    Assert-Test "T2.3.3: WindowFrame supports dragging and resizing" ($frameContent -match 'isDragging' -and $frameContent -match 'isResizing')
    Assert-Test "T2.3.4: WindowFrame enforces minimum 40 percent map visibility" ($frameContent -match 'maxAllowedW = window.innerWidth \* 0.6' -or $frameContent -match '50vw')
    Assert-Test "T2.3.5: WindowFrame supports snap modes" ($frameContent -match 'right-half' -and $frameContent -match 'top-right-quarter')
    Assert-Test "T2.3.6: WindowFrame supports minimize and maximize" ($frameContent -match 'onMinimize' -and $frameContent -match 'onToggleMaximize')
}

if (Test-Path $windowManagerFile) {
    $managerContent = Get-Content $windowManagerFile -Raw -Encoding UTF8
    Assert-Test "T2.3.7: WindowManager has Taskbar dock for minimized windows" ($managerContent -match 'minimizedWindowList')
}

# Test 4: Check Workspace Types
$typesFile = "C:\Users\adm\Downloads\web34\frontend\types\workspace.ts"
Assert-Test "T2.4.1: workspace.ts exists" (Test-Path $typesFile)
if (Test-Path $typesFile) {
    $typesContent = Get-Content $typesFile -Raw -Encoding UTF8
    Assert-Test "T2.4.2: ToolId and SnapPosition types are properly defined" ($typesContent -match 'type ToolId' -and $typesContent -match 'type SnapPosition')
}

Write-Host "-----------------------------------------------------" -ForegroundColor Cyan
Write-Host "TOTAL TESTS: $($passed + $failed) | PASSED: $passed | FAILED: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "=====================================================" -ForegroundColor Cyan

if ($failed -gt 0) { exit 1 } else { exit 0 }
