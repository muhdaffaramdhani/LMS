#!/bin/bash

# EduPlatform Backend - Quick Start Script
# This script starts the backend API using Docker

set -e

echo "🚀 Starting EduPlatform Backend..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed!"
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed!"
    echo "Please install Docker Compose or update Docker Desktop"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "❌ Error: Docker daemon is not running!"
    echo "Please start Docker Desktop"
    exit 1
fi

echo "✅ Docker is ready"
echo ""

# Ask user which mode to run
echo "Which mode do you want to run?"
echo "1) Production (default) - Uses Gunicorn, better for testing"
echo "2) Development - Uses runserver, hot-reload enabled"
echo ""
read -p "Enter choice [1-2] (default: 1): " choice

case $choice in
    2)
        echo ""
        echo "🔧 Starting in DEVELOPMENT mode..."
        echo "   - Hot-reload enabled"
        echo "   - Django development server"
        echo ""
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    *)
        echo ""
        echo "🏭 Starting in PRODUCTION mode..."
        echo "   - Gunicorn WSGI server"
        echo "   - Optimized for performance"
        echo ""
        docker-compose up --build
        ;;
esac
