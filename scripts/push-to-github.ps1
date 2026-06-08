param(
  [string]$RepoName = "602-ops-portal",
  [switch]$Private = $true
)

$ErrorActionPreference = "Stop"

function Require-Command {
  param([string]$Name, [string]$InstallHint)

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    Write-Host ""
    Write-Host "Missing required tool: $Name" -ForegroundColor Yellow
    Write-Host $InstallHint
    exit 1
  }
}

Require-Command "git" "Install Git for Windows from https://git-scm.com/download/win"
Require-Command "gh" "Install GitHub CLI from https://cli.github.com/"

if (-not (Test-Path ".git")) {
  git init
  git branch -M main
}

git add .

$hasCommit = $true
git rev-parse --verify HEAD *> $null
if ($LASTEXITCODE -ne 0) {
  $hasCommit = $false
}

if ($hasCommit) {
  git commit -m "Prepare 602 Ops Portal for deployment" --allow-empty
} else {
  git commit -m "Initial 602 Ops Portal MVP"
}

$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
  gh auth login --web --git-protocol https
}

$visibility = "--public"
if ($Private) {
  $visibility = "--private"
}

$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
  gh repo create $RepoName $visibility --source . --remote origin --push
} else {
  git push -u origin main
}

Write-Host ""
Write-Host "GitHub repository is ready." -ForegroundColor Green
gh repo view --web
