# Automated Test Suite for Phase 6: Convex Backend Schema & REST APIs (VN34MG)
$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   VN34MG AUTOMATED TEST SUITE - PHASE 6 (BACKEND & APIS) " -ForegroundColor Cyan
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

# 1. Convex Schema Verification (8 Tables)
$schemaFile = "C:\Users\adm\Downloads\web34\backend\convex\schema.ts"
Assert-Test "T6.1.1: Convex schema.ts exists" (Test-Path $schemaFile)
if (Test-Path $schemaFile) {
    $schema = [System.IO.File]::ReadAllText($schemaFile, [System.Text.Encoding]::UTF8)
    Assert-Test "T6.1.2: Table 'provinces' defined in schema" ($schema -match 'provinces: defineTable')
    Assert-Test "T6.1.3: Table 'regions' defined in schema" ($schema -match 'regions: defineTable')
    Assert-Test "T6.1.4: Table 'source_catalog' defined in schema" ($schema -match 'source_catalog: defineTable')
    Assert-Test "T6.1.5: Tables 'chat_sessions' & 'chat_messages' defined" ($schema -match 'chat_sessions: defineTable' -and $schema -match 'chat_messages: defineTable')
    Assert-Test "T6.1.6: Table 'question_bank' defined in schema" ($schema -match 'question_bank: defineTable')
    Assert-Test "T6.1.7: Table 'notes' defined in schema" ($schema -match 'notes: defineTable')
    Assert-Test "T6.1.8: Tables 'study_sets' & 'study_attempts' defined" ($schema -match 'study_sets: defineTable' -and $schema -match 'study_attempts: defineTable')
}

# 2. Convex Server Functions & Seed Verification
$convexFiles = @("provinces.ts", "regions.ts", "chat.ts", "questions.ts", "notes.ts", "study.ts", "seed.ts")
foreach ($f in $convexFiles) {
    $path = "C:\Users\adm\Downloads\web34\backend\convex\$f"
    Assert-Test "T6.2: Convex function file $f exists" (Test-Path $path)
}

# 3. REST API Routes Verification
$healthRoute = "C:\Users\adm\Downloads\web34\frontend\app\api\health\route.ts"
$provRoute = "C:\Users\adm\Downloads\web34\frontend\app\api\provinces\route.ts"
$regRoute = "C:\Users\adm\Downloads\web34\frontend\app\api\regions\route.ts"

Assert-Test "T6.3.1: REST API /api/health route exists" (Test-Path $healthRoute)
Assert-Test "T6.3.2: REST API /api/provinces route exists" (Test-Path $provRoute)
Assert-Test "T6.3.3: REST API /api/regions route exists" (Test-Path $regRoute)

# 4. REST API Direct Invocation Test via Node script
$jsTestFile = "C:\Users\adm\Downloads\web34\scratch\test_api_logic.js"
if (Test-Path $jsTestFile) {
    $nodeApiRaw = & "C:\Program Files\nodejs\node.exe" $jsTestFile
    $nodeApiTest = $nodeApiRaw | ConvertFrom-Json

    Assert-Test "T6.3.4: /api/health includes sovereignty archipelagos" ($nodeApiTest.healthHasHoangSa -and $nodeApiTest.healthHasTruongSa)
    Assert-Test "T6.4.1: /api/provinces returns exactly 34 provinces" ($nodeApiTest.totalProvinces -eq 34)
    Assert-Test "T6.4.2: /api/provinces includes Da Nang" ($nodeApiTest.hasDaNang -eq $true)
    Assert-Test "T6.4.3: /api/provinces includes Khanh Hoa" ($nodeApiTest.hasKhanhHoa -eq $true)
}

Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
Write-Host "TOTAL TESTS: $($passed + $failed) | PASSED: $passed | FAILED: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================================" -ForegroundColor Cyan

if ($failed -gt 0) { exit 1 } else { exit 0 }
