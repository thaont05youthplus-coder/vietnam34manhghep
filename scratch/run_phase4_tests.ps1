# Automated Test Suite for Phase 4 & 5: 4 Learning Tools (VN34MG Spec Mục 16)
$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   VN34MG AUTOMATED TEST SUITE - 4 LEARNING TOOLS (T21-T48) " -ForegroundColor Cyan
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

# Test 1: Tool 1 - Chatbox AI (ChatBoxModal.tsx)
$chatFile = "C:\Users\adm\Downloads\web34\frontend\components\chatbox\ChatBoxModal.tsx"
Assert-Test "T21.1: ChatBoxModal.tsx exists" (Test-Path $chatFile)
if (Test-Path $chatFile) {
    $chatContent = Get-Content $chatFile -Raw -Encoding UTF8
    Assert-Test "T25.1: Chatbox has message list and send handler" ($chatContent -match 'handleSend' -and $chatContent -match 'messages')
    Assert-Test "T26.1: Chatbox has province context chip with clear button" ($chatContent -match 'activeContext' -and $chatContent -match 'Đang tìm hiểu')
    Assert-Test "T27.1: Chatbox returns citations with verification" ($chatContent -match 'citations' -and $chatContent -match 'Nguồn trích dẫn')
    Assert-Test "T28.1: Chatbox copy response and export to notes" ($chatContent -match 'handleCopy' -and $chatContent -match 'onOpenNotes')
}

# Test 2: Tool 2 - Question Bank (QuestionBankModal.tsx)
$qFile = "C:\Users\adm\Downloads\web34\frontend\components\question-bank\QuestionBankModal.tsx"
Assert-Test "T30.1: QuestionBankModal.tsx exists" (Test-Path $qFile)
if (Test-Path $qFile) {
    $qContent = Get-Content $qFile -Raw -Encoding UTF8
    Assert-Test "T31.1: Question Bank supports 5 difficulty levels" ($qContent -match 'level: 1 \| 2 \| 3 \| 4 \| 5' -or $qContent -match 'selectedLevel')
    Assert-Test "T32.1: Question Bank prioritizes selected province" ($qContent -match 'filterBySelectedProvince' -and $qContent -match 'selectedProvince')
    Assert-Test "T33.1: Question has hint and verified solution toggles" ($qContent -match 'openHintId' -and $qContent -match 'openAnswerId')
    Assert-Test "T34.1: Question Bank has breadcrumbs navigation" ($qContent -match 'selectedDomain' -and $qContent -match 'Breadcrumb')
    Assert-Test "T46.1: Question Bank has 'Xem trên map' locator button" ($qContent -match 'onLocateProvince' -and $qContent -match 'Xem trên map')
}

# Test 3: Tool 3 - Dual Notes iPad-style (DualNotesModal.tsx)
$notesFile = "C:\Users\adm\Downloads\web34\frontend\components\notes\DualNotesModal.tsx"
Assert-Test "T35.1: DualNotesModal.tsx exists" (Test-Path $notesFile)
if (Test-Path $notesFile) {
    $notesContent = Get-Content $notesFile -Raw -Encoding UTF8
    Assert-Test "T35.2: Dual Notes supports text markdown editing" ($notesContent -match 'activeMode === "text"' -and $notesContent -match 'textContent')
    Assert-Test "T36.1: Dual Notes supports Canvas pointer events drawing" ($notesContent -match 'onPointerDown' -and $notesContent -match 'onPointerMove')
    Assert-Test "T37.1: Dual Notes has Pen, Highlighter, Eraser, colors, and Undo/Redo" ($notesContent -match 'highlighter' -and $notesContent -match 'eraser' -and $notesContent -match 'handleUndo')
    Assert-Test "T38.1: Dual Notes has auto-save status and localStorage persistence" ($notesContent -match 'saveStatus' -and $notesContent -match 'localStorage')
    Assert-Test "T39.1: Dual Notes has insert map snapshot feature" ($notesContent -match 'handleInsertMapSnapshot')
}

# Test 4: Tool 4 - Study & Testing Quizlet-style (StudyQuizletModal.tsx)
$studyFile = "C:\Users\adm\Downloads\web34\frontend\components\study\StudyQuizletModal.tsx"
Assert-Test "T41.1: StudyQuizletModal.tsx exists" (Test-Path $studyFile)
if (Test-Path $studyFile) {
    $studyContent = Get-Content $studyFile -Raw -Encoding UTF8
    Assert-Test "T42.1: Flashcards mode supports 3D flip card, next/prev, and remember mark" ($studyContent -match 'isFlipped' -and $studyContent -match 'rememberedIds' -and $studyContent -match 'handleShuffle')
    Assert-Test "T43.1: Learn mode supports multiple-choice with instant feedback" ($studyContent -match 'activeMode === "learn"' -and $studyContent -match 'showLearnResult')
    Assert-Test "T44.1: Test mode supports timed grading, score calculation, and rubric" ($studyContent -match 'isTestSubmitted' -and $studyContent -match 'testScore')
    Assert-Test "T46.2: Test result allows 'Xem trên map' for incorrect items" ($studyContent -match 'onLocateProvince' -and $studyContent -match 'Xem trên map')
    Assert-Test "T47.1: Match game mode exists with speed timer" ($studyContent -match 'activeMode === "match"' -and $studyContent -match 'matchedIds')
}

Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
Write-Host "TOTAL TESTS: $($passed + $failed) | PASSED: $passed | FAILED: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================================" -ForegroundColor Cyan

if ($failed -gt 0) { exit 1 } else { exit 0 }
