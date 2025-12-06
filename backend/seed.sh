#!/bin/bash

# EduPlatform Backend - Database Seeding Script
# This script seeds the database with dummy data for testing

set -e

echo "🌱 Seeding Database with Dummy Data..."
echo ""

# Check if containers are running
if ! docker-compose ps | grep -q "eduplatform_backend"; then
    echo "❌ Error: Backend container is not running!"
    echo ""
    echo "Please start the backend first:"
    echo "  docker-compose up -d"
    echo ""
    exit 1
fi

echo "Running seed_data command..."
echo ""

# Run the seed command
docker-compose exec web python manage.py seed_data

echo ""
echo "✅ Database seeding completed!"
echo ""
echo "========================================="
echo "         Test User Credentials"
echo "========================================="
echo ""
echo "ADMIN:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo "LECTURERS:"
echo "  Username: lecturer1, lecturer2, lecturer3"
echo "  Password: lecturer123"
echo ""
echo "STUDENTS:"
echo "  Username: student1 through student10"
echo "  Password: student123"
echo ""
echo "========================================="
echo "Access the application:"
echo "  API: http://localhost:8000/api/"
echo "  Admin Panel: http://localhost:8000/admin/"
echo "  API Docs: http://localhost:8000/api/schema/swagger-ui/"
echo "========================================="
echo ""
