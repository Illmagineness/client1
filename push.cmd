@echo off
chcp 65001 >nul
title Update to GitHub
cd /d "%~dp0"

set "BASH="
set "GITEXE="

rem --- locate git.exe ---
for /f "delims=" %%p in ('where git 2^>nul') do (
  if not defined GITEXE set "GITEXE=%%p"
)

rem --- derive Git Bash from <gitroot>\cmd\git.exe ---
if defined GITEXE (
  set "GITROOT=%GITEXE:\cmd\git.exe=%"
  if exist "%GITROOT%\bin\bash.exe" set "BASH=%GITROOT%\bin\bash.exe"
)

rem --- fallback: common install locations (never use C:\Windows\System32\bash.exe = WSL) ---
if not defined BASH if exist "D:\GIT\Git\bin\bash.exe" set "BASH=D:\GIT\Git\bin\bash.exe"
if not defined BASH if exist "%ProgramFiles%\Git\bin\bash.exe" set "BASH=%ProgramFiles%\Git\bin\bash.exe"
if not defined BASH if exist "%ProgramFiles(x86)%\Git\bin\bash.exe" set "BASH=%ProgramFiles(x86)%\Git\bin\bash.exe"
if not defined BASH if exist "%LOCALAPPDATA%\Programs\Git\bin\bash.exe" set "BASH=%LOCALAPPDATA%\Programs\Git\bin\bash.exe"

if not defined BASH (
  echo.
  echo [ERROR] Git Bash ^(bash.exe^) not found.
  echo         Please install Git for Windows: https://git-scm.com/download/win
  echo.
  pause
  exit /b 1
)

set "DIR=%~dp0"
set "DIR=%DIR:\=/%"

"%BASH%" -c "cd '%DIR%' && bash push.sh"

echo.
pause
