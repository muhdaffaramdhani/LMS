# Docker Setup Guide

This guide will help you run the EduPlatform backend using Docker with **zero manual configuration required**.

## Prerequisites

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- **Docker Compose** (included with Docker Desktop)

### Install Docker

- **Windows/Mac**: Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: Follow the [official Docker installation guide](https://docs.docker.com/engine/install/)

Verify installation:
```bash
docker --version
docker-compose --version
```

## Quick Start (3 Commands)

### Option 1: Production-like Setup (Recommended for Frontend Testing)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Build and start containers
docker-compose up --build

# 3. That's it! API is running at http://localhost:8000
```

### Option 2: Development Setup (Hot-reload enabled)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Build and start development containers
docker-compose -f docker-compose.dev.yml up --build

# 3. API is running at http://localhost:8000 with auto-reload
```

## What Happens Automatically?

When you run `docker-compose up`, the following happens automatically:

1. ✅ PostgreSQL database is created and started
2. ✅ Django backend is built and configured
3. ✅ Database migrations are applied
4. ✅ Static files are collected
5. ✅ Server starts and listens on port 8000
6. ✅ CORS is configured to accept all origins (development mode)

**No manual setup required!** The frontend can immediately connect to `http://localhost:8000/api/`

## API Endpoints

Once running, access:

- **API Root**: http://localhost:8000/api/
- **API Documentation (Swagger)**: http://localhost:8000/api/schema/swagger-ui/
- **API Schema (ReDoc)**: http://localhost:8000/api/schema/redoc/
- **Admin Panel**: http://localhost:8000/admin/

## Common Commands

### Start Services
```bash
# Start in foreground (see logs)
docker-compose up

# Start in background (detached mode)
docker-compose up -d

# Rebuild and start (after code changes)
docker-compose up --build
```

### Stop Services
```bash
# Stop running containers (Ctrl+C if in foreground, or:)
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f db
```

### Create Superuser (Admin Access)
```bash
# While containers are running
docker-compose exec web python manage.py createsuperuser
```

### Run Django Commands
```bash
# Run any Django management command
docker-compose exec web python manage.py <command>

# Examples:
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py makemigrations
docker-compose exec web python manage.py shell
```

### Access Database
```bash
# PostgreSQL CLI
docker-compose exec db psql -U eduplatform -d eduplatform

# Common psql commands:
# \dt              - List all tables
# \d <table_name>  - Describe table
# \q               - Quit
```

### Restart a Service
```bash
# Restart backend only
docker-compose restart web

# Restart database only
docker-compose restart db
```

## Environment Configuration

### Default Settings (Development)

The `docker-compose.yml` file includes sensible defaults:

- **Database**: PostgreSQL 15
  - Name: `eduplatform`
  - User: `eduplatform`
  - Password: `eduplatform123`
  - Port: `5432`

- **Backend**: Django
  - Port: `8000`
  - Debug: `True`
  - CORS: Allows all origins

### Custom Configuration

Create a `.env` file in the `backend` directory to override defaults:

```env
# Database
DB_NAME=eduplatform
DB_USER=eduplatform
DB_PASSWORD=your_password_here
DB_HOST=db
DB_PORT=5432

# Django
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# CORS
CORS_ALLOW_ALL_ORIGINS=True
```

## Frontend Integration

### Connecting from Frontend

Your frontend should connect to:

```javascript
const API_BASE_URL = 'http://localhost:8000/api/';

// Example: Fetch courses
fetch(`${API_BASE_URL}courses/`)
  .then(response => response.json())
  .then(data => console.log(data));
```

### CORS is Pre-configured

No CORS errors! The backend is configured to accept requests from:
- `http://localhost:3000` (React default)
- `http://localhost:8080` (Vue default)
- `http://localhost:5173` (Vite default)
- Any other origin (in development mode)

### Authentication (JWT)

1. **Login** to get tokens:
```javascript
POST http://localhost:8000/api/users/login/
Body: { "username": "user", "password": "pass" }
Response: { "access": "token...", "refresh": "token..." }
```

2. **Use access token** in subsequent requests:
```javascript
fetch('http://localhost:8000/api/courses/', {
  headers: {
    'Authorization': 'Bearer <access_token>'
  }
})
```

## Troubleshooting

### Port Already in Use

If port 8000 or 5432 is already in use:

```bash
# Change ports in docker-compose.yml
ports:
  - "8001:8000"  # Use 8001 instead of 8000 on host
```

### Database Connection Error

```bash
# Stop everything and remove volumes
docker-compose down -v

# Start fresh
docker-compose up --build
```

### Permission Denied (Linux)

```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and back in, then:
docker-compose up
```

### Container Won't Start

```bash
# Check logs
docker-compose logs web

# Rebuild without cache
docker-compose build --no-cache
docker-compose up
```

### Database Migrations Not Applied

```bash
# Manually run migrations
docker-compose exec web python manage.py migrate

# Check migration status
docker-compose exec web python manage.py showmigrations
```

## Development vs Production

### Development Setup (docker-compose.dev.yml)

- Uses Django development server (`runserver`)
- Hot-reload enabled (code changes reflect immediately)
- Debug mode enabled
- Verbose error messages
- Volume mounted for live code editing

### Production Setup (docker-compose.yml)

- Uses Gunicorn WSGI server
- Static files collected and served
- More secure settings
- Better performance
- Suitable for deployment

## Data Persistence

### Volumes

Data is persisted in Docker volumes:

- `postgres_data`: Database files
- `static_volume`: Static files (CSS, JS)
- `media_volume`: User uploads

### Backup Database

```bash
# Export database
docker-compose exec db pg_dump -U eduplatform eduplatform > backup.sql

# Restore database
docker-compose exec -T db psql -U eduplatform eduplatform < backup.sql
```

### Reset Everything

```bash
# Remove all containers, volumes, and images
docker-compose down -v --rmi all

# Start fresh
docker-compose up --build
```

## Health Checks

Both services include health checks:

- **Database**: Checks PostgreSQL is ready
- **Backend**: Checks API endpoint responds

View health status:
```bash
docker-compose ps
```

## Need Help?

- Check the logs: `docker-compose logs -f`
- Restart services: `docker-compose restart`
- Full reset: `docker-compose down -v && docker-compose up --build`
- Check Django admin: http://localhost:8000/admin/
- View API docs: http://localhost:8000/api/schema/swagger-ui/

## Summary

**For Frontend Developers:**
1. Install Docker Desktop
2. Run `docker-compose up` in the backend directory
3. Access the API at http://localhost:8000/api/
4. Done! No Python, PostgreSQL, or environment setup needed.

**For Backend Developers:**
1. Use `docker-compose -f docker-compose.dev.yml up` for development
2. Code changes auto-reload
3. Run Django commands with `docker-compose exec web python manage.py <command>`
