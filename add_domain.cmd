@echo off
title Cai dat ten mien www.vietnam34manhghep
:: Kiem tra quyen Admin, neu chua co thi tu dong goi UAC
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [THONG BAO] Dang yeu cau quyen Administrator (UAC)...
    echo Vui long bam YES tren hop thoai Windows vua hien ra!
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

:: Da co quyen Administrator!
cls
echo =====================================================================
echo  DANG CAI DAT TEN MIEN: www.vietnam34manhghep
echo =====================================================================
echo.

set HOSTS=%WINDIR%\System32\drivers\etc\hosts

:: Bo thuoc tinh Read-Only neu co
attrib -r "%HOSTS%" >nul 2>&1

:: Them vao file hosts
echo. >> "%HOSTS%"
echo 127.0.0.1  www.vietnam34manhghep >> "%HOSTS%"
echo 127.0.0.1  vietnam34manhghep >> "%HOSTS%"
echo [1/3] Da them 127.0.0.1 www.vietnam34manhghep vao file hosts!

:: Xoa cache DNS
ipconfig /flushdns >nul
echo [2/3] Da lam moi bo nho dem DNS (ipconfig /flushdns)!

:: Chuyen tiep cong 80 sang 3000
netsh interface portproxy delete v4tov4 listenport=80 listenaddress=127.0.0.1 >nul 2>&1
netsh interface portproxy add v4tov4 listenport=80 listenaddress=127.0.0.1 connectport=3000 connectaddress=127.0.0.1 >nul 2>&1
echo [3/3] Da cau hinh chuyen tiep cong 80 -> 3000!

echo.
echo =====================================================================
echo  DA HOAN TAT 100%!
echo  Trinh duyet Chrome se tu dong mo ngay bay gio...
echo =====================================================================
echo.

start "" "http://www.vietnam34manhghep:3000"
start "" "http://www.vietnam34manhghep"
timeout /t 5
