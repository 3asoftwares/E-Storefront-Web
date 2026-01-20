# =============================================================================
# Docker Hub Build & Push Script (PowerShell)
# 3A Softwares - E-Storefront-Web
# =============================================================================
# This script builds and pushes Docker images to Docker Hub
#
# Usage:
#   .\scripts\docker-push.ps1              # Push latest
#   .\scripts\docker-push.ps1 -Version v1.1.0  # Push specific version
#   .\scripts\docker-push.ps1 -Version dev     # Push dev image only
# =============================================================================

param(
    [string]$Version = "latest"
)

# Configuration
$DockerHubUsername = "3asoftwares"
$ImageName = "storefront"

Write-Host "=========================================" -ForegroundColor Green
Write-Host " Docker Hub Build & Push Script" -ForegroundColor Green
Write-Host " 3A Softwares - E-Storefront-Web" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "Error: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if logged in to Docker Hub
Write-Host "Checking Docker Hub login..." -ForegroundColor Yellow
$loginCheck = docker info 2>&1 | Select-String "Username"
if (-not $loginCheck) {
    Write-Host "Please login to Docker Hub:" -ForegroundColor Yellow
    docker login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker login failed." -ForegroundColor Red
        exit 1
    }
}

# Function to build and push
function Build-And-Push {
    param(
        [string]$Dockerfile,
        [string]$Tag,
        [string]$Platform
    )
    
    Write-Host "`nBuilding: ${DockerHubUsername}/${ImageName}:${Tag}" -ForegroundColor Green
    Write-Host "Dockerfile: $Dockerfile"
    Write-Host "Platform: $Platform"
    Write-Host ""
    
    # Build with multi-platform support
    docker buildx build `
        --platform $Platform `
        -f $Dockerfile `
        -t "${DockerHubUsername}/${ImageName}:${Tag}" `
        --push `
        .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Pushed: ${DockerHubUsername}/${ImageName}:${Tag}" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to push: ${DockerHubUsername}/${ImageName}:${Tag}" -ForegroundColor Red
        exit 1
    }
}

# Create buildx builder if not exists
$builderExists = docker buildx inspect multiarch 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating multi-platform builder..." -ForegroundColor Yellow
    docker buildx create --name multiarch --use
}

# Use the builder
docker buildx use multiarch

# Platform support for both Intel and Apple Silicon Macs, plus Windows
$Platforms = "linux/amd64,linux/arm64"

switch ($Version) {
    "dev" {
        Build-And-Push -Dockerfile "Dockerfile.dev" -Tag "dev" -Platform $Platforms
    }
    "prod" {
        Build-And-Push -Dockerfile "Dockerfile.prod" -Tag "latest" -Platform $Platforms
    }
    "production" {
        Build-And-Push -Dockerfile "Dockerfile.prod" -Tag "latest" -Platform $Platforms
    }
    "all" {
        Build-And-Push -Dockerfile "Dockerfile.dev" -Tag "dev" -Platform $Platforms
        Build-And-Push -Dockerfile "Dockerfile.prod" -Tag "latest" -Platform $Platforms
    }
    default {
        # Build with specific version tag
        Build-And-Push -Dockerfile "Dockerfile.prod" -Tag $Version -Platform $Platforms
        Build-And-Push -Dockerfile "Dockerfile.prod" -Tag "latest" -Platform $Platforms
        Build-And-Push -Dockerfile "Dockerfile.dev" -Tag "dev" -Platform $Platforms
    }
}

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host " Build & Push Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Images available at:"
Write-Host "  https://hub.docker.com/r/${DockerHubUsername}/${ImageName}" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pull commands:"
Write-Host "  docker pull ${DockerHubUsername}/${ImageName}:latest  " -NoNewline
Write-Host "# Production" -ForegroundColor Green
Write-Host "  docker pull ${DockerHubUsername}/${ImageName}:dev     " -NoNewline
Write-Host "# Development" -ForegroundColor Green
Write-Host "  docker pull ${DockerHubUsername}/${ImageName}:${Version}  " -NoNewline
Write-Host "# Specific version" -ForegroundColor Green
Write-Host ""
