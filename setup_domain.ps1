# Tự động yêu cầu quyền Admin và cấu hình tên miền vietnam34manhghep
$hostsPath = "$env:WINDIR\System32\drivers\etc\hosts"

if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "  THIET LAP TEN MIEN VIETNAM34MANHGHEP CHO BAN DO SO 34 TINH THANH  " -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

$hostsContent = Get-Content $hostsPath -Raw -ErrorAction SilentlyContinue

if ($hostsContent -notmatch "vietnam34manhghep") {
    Write-Host "Dang ghi vao file hosts: $hostsPath..." -ForegroundColor Yellow
    $entry = "`r`n# Ten mien noi bo cho Du an VN34MG`r`n127.0.0.1  vietnam34manhghep`r`n127.0.0.1  www.vietnam34manhghep`r`n"
    Add-Content -Path $hostsPath -Value $entry -Force
    Write-Host "[OK] Da them 127.0.0.1 vietnam34manhghep vao file hosts!" -ForegroundColor Green
} else {
    Write-Host "[OK] Ten mien vietnam34manhghep da co san trong file hosts!" -ForegroundColor Green
}

# Flush DNS
Write-Host "Dang xoa bo nho cache DNS (ipconfig /flushdns)..." -ForegroundColor Yellow
ipconfig /flushdns | Out-Null

# Port forwarding 80 -> 3000
Write-Host "Dang cau hinh chuyen tiep cong 80 sang 3000..." -ForegroundColor Yellow
netsh interface portproxy delete v4tov4 listenport=80 listenaddress=127.0.0.1 2>$null
netsh interface portproxy add v4tov4 listenport=80 listenaddress=127.0.0.1 connectport=3000 connectaddress=127.0.0.1 2>$null

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "  HOAN TAT! Ban co the truy cap bang cac duong dan:" -ForegroundColor Green
Write-Host "    - http://vietnam34manhghep" -ForegroundColor White
Write-Host "    - http://www.vietnam34manhghep" -ForegroundColor White
Write-Host "    - http://vietnam34manhghep:3000" -ForegroundColor White
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

Start-Process "http://vietnam34manhghep"
Start-Sleep -Seconds 3
