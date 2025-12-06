@echo off
REM EduPlatform - Create Admin User Script for Windows
REM This script creates a Django superuser using Docker

echo.
echo ========================================
echo   Creating Admin/Superuser Account
echo ========================================
echo.

REM Check if containers are running
docker-compose ps | findstr "eduplatform_backend" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Backend container is not running!
    echo.
    echo Please start the backend first:
    echo   docker-compose up -d
    echo.
    pause
    exit /b 1
)

echo Creating superuser account...
echo.
echo You will be prompted to enter:
echo   - Username
echo   - Email (optional)
echo   - Password (twice)
echo.

REM Run createsuperuser command in the container
docker-compose exec web python manage.py createsuperuser

echo.
echo ========================================
echo   Superuser created successfully!
echo ========================================
echo.
echo You can now login at:
echo   - Admin Panel: http://localhost:8000/admin/
echo   - API: http://localhost:8000/api/users/login/
echo.
pause
