@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
rem  Конвертер правил Shadowrocket -> AnyWhere (.arrs)
rem  Использование: Convert.bat input.txt output.arrs [SetName]

set "input=%~1" & set "output=%~2" & set "rname=%~3"
if "%input%"=="" set "input=input.txt"
if "%output%"=="" set "output=output.arrs"
if "%rname%"=="" set "rname=Converted"
if not exist "%input%" (echo Файл "%input%" не найден.& exit /b 1)
if exist "%output%" del "%output%"

rem --- шапка для Anywhere ---
echo name = %rname%>>"%output%"

for /f "usebackq tokens=1,2 delims=," %%A in ("%input%") do (
    set "type=%%A" & set "value=%%B"
    for /f "tokens=* delims= " %%X in ("!type!") do set "type=%%X"
    for /f "tokens=* delims= " %%X in ("!value!") do set "value=%%X"
    rem убрать хвостовой пробел и ведущую точку
    if defined value (
        if "!value:~-1!"==" " set "value=!value:~0,-1!"
        if "!value:~0,1!"=="." set "value=!value:~1!"
    )
    set "code="
    if /i "!type!"=="DOMAIN-SUFFIX" set "code=2"
    if /i "!type!"=="DOMAIN" set "code=2"
    if /i "!type!"=="DOMAIN-KEYWORD" set "code=3"
    if /i "!type!"=="IP-CIDR" (
        echo.!value!|findstr /c:":" >nul && set "code=1" || set "code=0"
        rem если маски нет - угадать по нулевым октетам, иначе /32
        if "!value:/=!"=="!value!" (
            if "!code!"=="0" (
                for /f "tokens=1-4 delims=." %%1 in ("!value!") do (
                    set "o1=%%1" & set "o2=%%2" & set "o3=%%3" & set "o4=%%4"
                )
                if "!o4!"=="" (
                    rem не IPv4 вообще - просто /32
                    set "value=!value!/32"
                ) else if "!o4!"=="0" (
                    if "!o3!"=="0" (
                        if "!o2!"=="0" (
                            set "value=!value!/8"
                        ) else (
                            set "value=!value!/16"
                        )
                    ) else (
                        set "value=!value!/24"
                    )
                ) else (
                    set "value=!value!/32"
                )
            )
            if "!code!"=="1" (
                if "!value!"=="::" (
                    set "value=::/0"
                ) else (
                    set "value=!value!/128"
                )
            )
        )
    )
    if /i "!type!"=="IP-CIDR6" (
        set "code=1"
        if "!value:/=!"=="!value!" (
            if "!value!"=="::" (
                set "value=::/0"
            ) else (
                set "value=!value!/128"
            )
        )
    )
    if defined code if not "!value!"=="" echo !code!, !value!>>"%output%"
)
echo Готово. Результат сохранён в "%output%"
