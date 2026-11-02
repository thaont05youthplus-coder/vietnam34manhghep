@echo off
:: Script tu dong yeu cau quyen Administrator de them ten mien vao hosts va netsh
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Dang yeu cau quyen Administrator (UAC)...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0""", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"

cls
echo =====================================================================
echo  THIET LAP TEN MIEN VIETNAM34MANHGHEP CHO BAN DO SO 34 TINH THANH
echo =====================================================================
echo.

set HOSTS=%WINDIR%\System32\drivers\etc\hosts

findstr /i "vietnam34manhghep" "%HOSTS%" >nul
if %errorlevel% equ 0 (
    echo [OK] Ten mien vietnam34manhghep da ton tai trong file hosts.
) else (
    echo Dang ghi vao file hosts: %HOSTS% ...
    attrib -R "%HOSTS%" >nul 2>&1
    echo. >> "%HOSTS%"
    echo # Ten mien noi bo cho Du an VN34MG >> "%HOSTS%"
    echo 127.0.0.1  vietnam34manhghep >> "%HOSTS%"
    echo 127.0.0.1  www.vietnam34manhghep >> "%HOSTS%"
    echo [OK] Da them 127.0.0.1 vietnam34manhghep thanh cong!
)

:: Xoa bo nho cache DNS
echo Dang lam moi bo nho cache DNS...
ipconfig /flushdns >nul

:: Chuyen tiep cong 80 sang cong 3000 de truy cap thang khong can :3000
echo Dang cau hinh chuyen tiep cong 80 sang 3000...
netsh interface portproxy delete v4tov4 listenport=80 listenaddress=127.0.0.1 >nul 2>&1
netsh interface portproxy add v4tov4 listenport=80 listenaddress=127.0.0.1 connectport=3000 connectaddress=127.0.0.1 >nul 2>&1

echo.
echo =====================================================================
echo  HOAN TAT CAI DAT!
echo.
echo  Gio day ban co the truy cap vao ung dung bang:
echo   - http://vietnam34manhghep
echo   - http://www.vietnam34manhghep
echo   (hoac http://vietnam34manhghep:3000)
echo =====================================================================
echo.

:: Tu dong mo tren trinh duyet Chrome
start "" "http://vietnam34manhghep"
timeout /t 5 >nul
