@echo off
setlocal

set "APP_DIR=%~dp0"
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;%PATH%"

cd /d "%APP_DIR%"

echo.
echo Uploading 602 Ops Portal to GitHub...
echo Folder: %APP_DIR%
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo Git was not found. Install Git for Windows, then run this again.
  pause
  exit /b 1
)

where gh >nul 2>nul
if errorlevel 1 (
  echo GitHub CLI was not found. Install GitHub CLI, then run this again.
  pause
  exit /b 1
)

gh auth status >nul 2>nul
if errorlevel 1 (
  echo Please log in to GitHub in the browser window.
  gh auth login --web --git-protocol https
)

git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
  git init
  git branch -M main
  git add .
  git config user.email dothman12@gmail.com
  git config user.name "602 Ops Admin"
  git commit -m "Initial 602 Ops Portal MVP"
)

for /f "delims=" %%u in ('gh api user --jq .login') do set "GITHUB_USER=%%u"

if "%GITHUB_USER%"=="" (
  echo Could not read your GitHub username. Run gh auth login again.
  pause
  exit /b 1
)

echo GitHub user: %GITHUB_USER%
echo.

gh repo view "%GITHUB_USER%/602-ops-portal" >nul 2>nul
if errorlevel 1 (
  echo Creating GitHub repo...
  gh repo create 602-ops-portal --private --source . --remote origin --push
) else (
  echo Repo already exists. Connecting and pushing...
  git remote remove origin >nul 2>nul
  git remote add origin "https://github.com/%GITHUB_USER%/602-ops-portal.git"
  git push -u origin main
)

echo.
echo Done. Opening the GitHub repo...
gh repo view "%GITHUB_USER%/602-ops-portal" --web
pause
