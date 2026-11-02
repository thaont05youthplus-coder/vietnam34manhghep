const fs = require('fs');
const path = require('path');

console.log("================================================================================");
console.log("   VN34MG AUTOMATED TEST SUITE - PHASE 7 (CROSS-TOOL, SHORTCUTS, SHARE & NOTES)");
console.log("================================================================================");

let passed = 0;
let failed = 0;

function assertTest(name, condition) {
  if (condition) {
    console.log(` [PASS] ${name}`);
    passed++;
  } else {
    console.log(` [FAIL] ${name}`);
    failed++;
  }
}

const rootDir = path.join(__dirname, '..');
const sidebarFile = path.join(rootDir, 'frontend', 'components', 'layout', 'Sidebar.tsx');
const pageFile = path.join(rootDir, 'frontend', 'app', 'page.tsx');
const notesFile = path.join(rootDir, 'frontend', 'components', 'notes', 'DualNotesModal.tsx');
const chatFile = path.join(rootDir, 'frontend', 'components', 'chatbox', 'ChatBoxModal.tsx');
const shortcutsFile = path.join(rootDir, 'frontend', 'components', 'workspace', 'KeyboardShortcutsModal.tsx');
const headerFile = path.join(rootDir, 'frontend', 'components', 'layout', 'Header.tsx');

// 1. Notes refactoring: no "Ghi chú kép iPad"
if (fs.existsSync(sidebarFile)) {
  const sidebar = fs.readFileSync(sidebarFile, 'utf-8');
  assertTest("T7.1.1: Sidebar labels tool as 'Ghi chú' (not 'Ghi chú kép iPad')", sidebar.includes('name: "Ghi chú"') && !sidebar.includes('Ghi chú kép iPad'));
}

if (fs.existsSync(pageFile)) {
  const page = fs.readFileSync(pageFile, 'utf-8');
  assertTest("T7.1.2: Window Manager registers window title as 'Ghi chú'", page.includes('title: "Ghi chú"'));
}

if (fs.existsSync(notesFile)) {
  const notes = fs.readFileSync(notesFile, 'utf-8');
  assertTest("T7.1.3: DualNotesModal uses 'Vẽ tay' button (no iPad reference in UI)", notes.includes('<span>Vẽ tay</span>') && !notes.includes('<span>Vẽ tay iPad</span>'));
  assertTest("T7.1.4: DualNotesModal supports Export Note (.md) feature", notes.includes('handleExportNote') && notes.includes('Xuất file'));
}

if (fs.existsSync(chatFile)) {
  const chat = fs.readFileSync(chatFile, 'utf-8');
  assertTest("T7.1.5: Chatbox button title is 'Lưu vào Ghi chú'", chat.includes('title="Lưu vào Ghi chú"'));
}

// 2. Keyboard shortcuts modal
assertTest("T7.2.1: KeyboardShortcutsModal.tsx component exists", fs.existsSync(shortcutsFile));
if (fs.existsSync(shortcutsFile)) {
  const shortcuts = fs.readFileSync(shortcutsFile, 'utf-8');
  assertTest("T7.2.2: Covers modes 1, 2, 3 shortcuts", shortcuts.includes('key: "1"') && shortcuts.includes('key: "2"') && shortcuts.includes('key: "3"'));
  assertTest("T7.2.3: Covers 4 tools C, Q, N, S shortcuts", shortcuts.includes('key: "C"') && shortcuts.includes('key: "Q"') && shortcuts.includes('key: "N"') && shortcuts.includes('key: "S"'));
  assertTest("T7.2.4: Covers Escape and ? shortcuts", shortcuts.includes('key: "Esc"') && shortcuts.includes('key: "?"'));
}

// 3. Global shortcuts & URL state sync in page.tsx
if (fs.existsSync(pageFile)) {
  const page = fs.readFileSync(pageFile, 'utf-8');
  assertTest("T7.3.1: Global keydown listener implemented in page.tsx", page.includes('window.addEventListener("keydown", handleKeyDown)'));
  assertTest("T7.3.2: URL state sync parses mode, province, and tool params on mount", page.includes('new URLSearchParams(window.location.search)') && page.includes('modeParam') && page.includes('provinceParam'));
  assertTest("T7.3.3: Share URL state handler implemented", page.includes('handleShare') && page.includes('navigator.clipboard'));
  assertTest("T7.3.4: KeyboardShortcutsModal integrated into main page", page.includes('<KeyboardShortcutsModal'));
}

// 4. Header enhancements
if (fs.existsSync(headerFile)) {
  const header = fs.readFileSync(headerFile, 'utf-8');
  assertTest("T7.4.1: Header contains Keyboard Shortcuts trigger button", header.includes('onOpenShortcuts') && header.includes('Phím tắt'));
  assertTest("T7.4.2: Header contains Share URL trigger button", header.includes('onShare') && header.includes('Chia sẻ'));
  assertTest("T7.4.3: Header badge updated to 'Bản đồ 34' (not 'Giai đoạn 2')", header.includes('Bản đồ 34') && !header.includes('Giai đoạn 2'));
}

console.log("--------------------------------------------------------------------------------");
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log("================================================================================");

if (failed > 0) process.exit(1);
else process.exit(0);
