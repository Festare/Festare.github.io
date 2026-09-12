@echo off
setlocal enabledelayedexpansion

rem  Конвертер правил Shadowrocket -> AnyWhere
rem  Использование: convert.bat input.txt output.txt

set "input=%~1" & set "output=%~2"
if "%input%"=="" set "input=input.txt"
if "%output%"=="" set "output=output.txt"
if not exist "%input%" (echo Файл "%input%" не найден.& pause & exit /b 1)
if exist "%output%" del "%output%"

for /f "usebackq tokens=1,2 delims=," %%A in ("%input%") do (
    set "type=%%A" & set "value=%%B"
    for /f "tokens=* delims= " %%X in ("!type!") do set "type=%%X"
    for /f "tokens=* delims= " %%X in ("!value!") do set "value=%%X"
    set "code="
    if /i "!type!"=="DOMAIN-SUFFIX" set "code=2"
    if /i "!type!"=="DOMAIN" set "code=2"
    if /i "!type!"=="DOMAIN-KEYWORD" set "code=3"
    if /i "!type!"=="IP-CIDR" (
        echo !value!|findstr /c:":" >nul && set "code=1" || set "code=0"
    )
    if defined code if not "!value!"=="" echo !code!, !value!>>"%output%"
)
echo Готово. Результат сохранён в "%output%"
pause