@echo off
REM EduPlatform Backend - Quick Start Script for Windows
REM This script starts the backend API using Docker

echo.
echo ========================================
echo   EduPlatform Backend - Quick Start
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed!
    echo.
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed!
    echo.
    echo Please install Docker Compose or update Docker Desktop
    echo.
    pause
    exit /b 1
)

REM Check if Docker daemon is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker daemon is not running!
    echo.
    echo Please start Docker Desktop and wait for it to be ready.
    echo.
    pause
    exit /b 1
)

echo [OK] Docker is ready
echo.

REM Ask user which mode to run
echo Which mode do you want to run?
echo.
echo 1) Production (default) - Uses Gunicorn, better for testing
echo 2) Development - Uses runserver, hot-reload enabled
echo.
set /p choice="Enter choice [1-2] (default: 1): "

if "%choice%"=="2" (
    echo.
    echo ========================================
    echo   Starting in DEVELOPMENT mode...
    echo ========================================
    echo   - Hot-reload enabled
    echo   - Django development server
    echo   - API: http://localhost:8000/api/
    echo ========================================
    echo.
    docker-compose -f docker-compose.dev.yml up --build
) else (
    echo.
    echo ========================================
    echo   Starting in PRODUCTION mode...
    echo ========================================
    echo   - Gunicorn WSGI server
    echo   - Optimized for performance
    echo   - API: http://localhost:8000/api/
    echo ========================================
    echo.
    docker-compose up --build
)

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to start containers!
    echo.
    echo Troubleshooting tips:
    echo 1. Make sure ports 8000 and 5432 are not in use
    echo 2. Try: docker-compose down -v
    echo 3. Then run this script again
    echo.
    pause
    exit /b 1
)
