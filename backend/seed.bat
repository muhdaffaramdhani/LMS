@echo off
REM EduPlatform Backend - Database Seeding Script for Windows
REM This script seeds the database with dummy data for testing

echo.
echo ========================================
echo   EduPlatform - Database Seeding
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

echo Running seed_data command...
echo.

REM Run the seed command
docker-compose exec web python manage.py seed_data

echo.
echo ========================================
echo   Database Seeding Completed!
echo ========================================
echo.
echo ========================================
echo        Test User Credentials
echo ========================================
echo.
echo ADMIN:
echo   Username: admin
echo   Password: admin123
echo   Email: admin@eduplatform.com
echo.
echo LECTURERS:
echo   Username: lecturer1, lecturer2, lecturer3
echo   Password: lecturer123
echo   Emails: lecturer[1-3]@eduplatform.com
echo.
echo STUDENTS:
echo   Username: student1 through student10
echo   Password: student123
echo   Emails: student[1-10]@eduplatform.com
echo.
echo ========================================
echo     Access the Application:
echo ========================================
echo   API Root: http://localhost:8000/api/
echo   Admin Panel: http://localhost:8000/admin/
echo   API Docs: http://localhost:8000/api/schema/swagger-ui/
echo   ReDoc: http://localhost:8000/api/schema/redoc/
echo ========================================
echo.
echo Data Created:
echo   - 1 Admin user
echo   - 3 Lecturer users
echo   - 10 Student users
echo   - 10 Courses
echo   - 30+ Enrollments
echo   - 50+ Materials
echo   - 40+ Assignments
echo   - Multiple Submissions
echo   - Multiple Discussions with Comments
echo.
echo You can now login and test all features!
echo.
pause
