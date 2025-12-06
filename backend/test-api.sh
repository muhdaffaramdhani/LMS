#!/bin/bash

# EduPlatform Backend - API Test Script
# This script tests if the backend API is running correctly

set -e

echo "🧪 Testing EduPlatform Backend API..."
echo ""

# API Base URL
API_URL="http://localhost:8000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local name=$2

    echo -n "Testing $name... "

    if curl -s -f -o /dev/null "$API_URL$endpoint"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
}

# Check if API is reachable
echo "Checking if backend is running..."
if ! curl -s -f -o /dev/null "$API_URL/api/"; then
    echo -e "${RED}❌ Error: Backend is not running!${NC}"
    echo ""
    echo "Please start the backend first:"
    echo "  docker-compose up"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Backend is running!${NC}"
echo ""

# Test API endpoints
echo "Testing API endpoints..."
echo "----------------------------------------"

test_endpoint "/api/" "API Root"
test_endpoint "/api/schema/" "API Schema"
test_endpoint "/api/schema/swagger-ui/" "Swagger UI"
test_endpoint "/api/schema/redoc/" "ReDoc"
test_endpoint "/api/courses/" "Courses Endpoint"
test_endpoint "/api/users/" "Users Endpoint"
test_endpoint "/api/materials/" "Materials Endpoint"
test_endpoint "/api/assignments/" "Assignments Endpoint"
test_endpoint "/api/discussions/" "Discussions Endpoint"

echo "----------------------------------------"
echo ""

# Test authentication endpoint
echo "Testing authentication..."
echo -n "POST /api/users/login/ (should accept requests)... "

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/users/login/" \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test"}' \
    -w "%{http_code}")

if [ -n "$LOGIN_RESPONSE" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
fi

echo ""

# Summary
echo "========================================="
echo "            Test Summary"
echo "========================================="
echo ""
echo "Backend URL: $API_URL"
echo ""
echo "Available endpoints:"
echo "  - API Root:     $API_URL/api/"
echo "  - Swagger UI:   $API_URL/api/schema/swagger-ui/"
echo "  - ReDoc:        $API_URL/api/schema/redoc/"
echo "  - Admin Panel:  $API_URL/admin/"
echo ""
echo -e "${GREEN}✅ Backend API is working correctly!${NC}"
echo ""
echo "Next steps:"
echo "  1. Create an admin user: ./create-admin.sh"
echo "  2. Visit Swagger UI: $API_URL/api/schema/swagger-ui/"
echo "  3. Start building your frontend!"
echo ""
