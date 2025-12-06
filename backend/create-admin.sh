#!/bin/bash

# EduPlatform - Create Admin User Script
# This script creates a Django superuser using Docker

set -e

echo "🔐 Creating Admin/Superuser Account..."
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

echo "Creating superuser account..."
echo "You will be prompted to enter:"
echo "  - Username"
echo "  - Email (optional)"
echo "  - Password (twice)"
echo ""

# Run createsuperuser command in the container
docker-compose exec web python manage.py createsuperuser

echo ""
echo "✅ Superuser created successfully!"
echo ""
echo "You can now login at:"
echo "  - Admin Panel: http://localhost:8000/admin/"
echo "  - API: http://localhost:8000/api/users/login/"
echo ""
