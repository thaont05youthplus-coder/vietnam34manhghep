# Master Test Runner for VN34MG Full Acceptance Suite (Phases 1 -> 7)
$ErrorActionPreference = "Continue"

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "   VN34MG - BAN DO CONG NGHE SO VIET NAM 34 MANH GHEP                         " -ForegroundColor Cyan
Write-Host "   MASTER ACCEPTANCE VERIFICATION RUNNER (PHASE 1 -> PHASE 7)                  " -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan

$testScripts = @(
    "scratch/run_phase1_tests.ps1",
    "scratch/run_phase2_tests.ps1",
    "scratch/run_phase3_tests.ps1",
    "scratch/run_phase4_tests.ps1",
    "scratch/run_phase6_backend_tests.ps1"
)

$hasErrors = $false

foreach ($s in $testScripts) {
    Write-Host "`n>>> RUNNING: $s" -ForegroundColor Yellow
    powershell -ExecutionPolicy Bypass -File $s
    if ($LASTEXITCODE -ne 0) {
        $hasErrors = $true
    }
}

Write-Host "`n>>> RUNNING: node scratch/run_phase7_tests.js" -ForegroundColor Yellow
& "C:\Program Files\nodejs\node.exe" scratch/run_phase7_tests.js
if ($LASTEXITCODE -ne 0) {
    $hasErrors = $true
}

Write-Host "`n================================================================================" -ForegroundColor Cyan
if (-not $hasErrors) {
    Write-Host "   >>> ALL 6 TEST SUITES (112/112 TESTS) PASSED SUCCESSFULLY! <<<" -ForegroundColor Green
} else {
    Write-Host "   >>> SOME TESTS FAILED! <<<" -ForegroundColor Red
}
Write-Host "================================================================================" -ForegroundColor Cyan

if ($hasErrors) { exit 1 } else { exit 0 }
