# EduPlatform Backend - Quick Reference

## 🚀 Getting Started

### First Time Setup
```bash
# 1. Start the backend
docker-compose up

# 2. Create admin account (in another terminal)
./create-admin.sh        # Mac/Linux
create-admin.bat         # Windows
```

### Daily Use
```bash
# Start backend
docker-compose up -d

# Stop backend
docker-compose down
```

---

## 📋 Common Commands

### Start/Stop Services

```bash
# Start (foreground, see logs)
docker-compose up

# Start (background, detached)
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove all data
docker-compose down -v

# Restart a service
docker-compose restart web
```

### View Logs

```bash
# All logs (live)
docker-compose logs -f

# Backend logs only
docker-compose logs -f web

# Database logs only
docker-compose logs -f db

# Last 100 lines
docker-compose logs --tail=100 web
```

### Django Commands

```bash
# Create superuser
docker-compose exec web python manage.py createsuperuser

# Run migrations
docker-compose exec web python manage.py migrate

# Create new migrations
docker-compose exec web python manage.py makemigrations

# Django shell
docker-compose exec web python manage.py shell

# List all users
docker-compose exec web python manage.py shell -c "from users.models import User; print(User.objects.all())"

# Collect static files
docker-compose exec web python manage.py collectstatic --noinput
```

### Database Access

```bash
# PostgreSQL shell
docker-compose exec db psql -U eduplatform -d eduplatform

# Common psql commands:
\dt                    # List all tables
\d users_user          # Describe users table
\l                     # List all databases
\du                    # List all users
\q                     # Quit

# Run SQL query
docker-compose exec db psql -U eduplatform -d eduplatform -c "SELECT * FROM users_user;"

# Backup database
docker-compose exec db pg_dump -U eduplatform eduplatform > backup.sql

# Restore database
docker-compose exec -T db psql -U eduplatform eduplatform < backup.sql
```

---

## 🛠️ Troubleshooting

### Container Issues

```bash
# Check container status
docker-compose ps

# Rebuild containers
docker-compose build --no-cache

# Restart everything fresh
docker-compose down -v
docker-compose up --build

# Remove all Docker resources
docker-compose down -v --rmi all
docker system prune -a
```

### Port Already in Use

**Error**: `Bind for 0.0.0.0:8000 failed: port is already allocated`

```bash
# Option 1: Stop the process using the port
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9

# Option 2: Change port in docker-compose.yml
ports:
  - "8001:8000"  # Use port 8001 instead
```

### Database Connection Error

```bash
# Reset database
docker-compose down -v
docker-compose up

# Check database is healthy
docker-compose exec db pg_isready -U eduplatform
```

### Migration Issues

```bash
# Check migration status
docker-compose exec web python manage.py showmigrations

# Fake migrations (use with caution)
docker-compose exec web python manage.py migrate --fake

# Reset migrations (WARNING: loses data)
docker-compose down -v
docker-compose up
```

### Permission Issues (Linux)

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Apply changes (logout/login or run)
newgrp docker

# Fix file permissions
sudo chown -R $USER:$USER .
```

---

## 🔧 Development Mode

### Switch to Development Mode

```bash
# Uses Django runserver with hot-reload
docker-compose -f docker-compose.dev.yml up

# Or use the helper script
./start.sh              # Mac/Linux
start.bat               # Windows
# Then select option 2
```

### Code Changes

- **Production mode**: Restart container after code changes
  ```bash
  docker-compose restart web
  ```

- **Development mode**: Changes auto-reload, no restart needed

---

## 📊 Monitoring

### Check Service Health

```bash
# Container status
docker-compose ps

# Resource usage
docker stats

# Disk usage
docker system df
```

### Inspect Containers

```bash
# View container details
docker-compose exec web env

# Check Python packages
docker-compose exec web pip list

# Container shell access
docker-compose exec web bash
docker-compose exec db sh
```

---

## 🌐 API Endpoints

### Important URLs

- **API Root**: http://localhost:8000/api/
- **Swagger Docs**: http://localhost:8000/api/schema/swagger-ui/
- **ReDoc**: http://localhost:8000/api/schema/redoc/
- **Admin Panel**: http://localhost:8000/admin/

### Quick API Tests

```bash
# Health check
curl http://localhost:8000/api/

# List courses
curl http://localhost:8000/api/courses/

# Login
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Authenticated request
curl http://localhost:8000/api/courses/ \
  -H "Authorization: Bearer <your_token>"
```

---

## 💾 Data Management

### Reset Database

```bash
# Complete reset (removes all data)
docker-compose down -v
docker-compose up

# Then recreate admin
./create-admin.sh
```

### Seed Data (if available)

```bash
# Load fixtures
docker-compose exec web python manage.py loaddata fixtures/sample_data.json

# Create test data
docker-compose exec web python manage.py shell
>>> from users.models import User
>>> User.objects.create_user(username='student1', password='pass123', role='student')
```

### Backup Everything

```bash
# Backup database
docker-compose exec db pg_dump -U eduplatform eduplatform > db_backup.sql

# Backup media files
docker cp eduplatform_backend:/app/media ./media_backup

# Backup static files
docker cp eduplatform_backend:/app/staticfiles ./static_backup
```

---

## 🔐 Security Notes

### For Development
- CORS is wide open (`CORS_ALLOW_ALL_ORIGINS=True`)
- Debug mode is enabled
- Default credentials are public

### For Production
- Change `SECRET_KEY` in environment variables
- Set `DEBUG=False`
- Configure specific `ALLOWED_HOSTS`
- Set specific `CORS_ALLOWED_ORIGINS`
- Use strong database passwords
- Use environment variables, not hardcoded values

---

## 📱 Frontend Integration

### Connection Example

```javascript
// React/Vue/Angular frontend
const API_URL = 'http://localhost:8000/api/';

// Login
fetch(`${API_URL}users/login/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'user', password: 'pass' })
})
.then(res => res.json())
.then(data => {
  localStorage.setItem('access_token', data.access);
});

// Authenticated request
fetch(`${API_URL}courses/`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🆘 Quick Help

| Problem | Solution |
|---------|----------|
| Port 8000 in use | Change port in docker-compose.yml or kill process |
| Can't connect to DB | Run `docker-compose down -v && docker-compose up` |
| Code changes not reflecting | Restart: `docker-compose restart web` |
| Forgot admin password | Create new: `./create-admin.sh` |
| Container won't start | Check logs: `docker-compose logs web` |
| Out of disk space | Clean: `docker system prune -a` |

### Get Help

```bash
# Check logs
docker-compose logs -f web

# Full system restart
docker-compose down -v
docker-compose up --build

# Access Django shell for debugging
docker-compose exec web python manage.py shell
```

---

## 📚 Documentation

- **Docker Setup**: See [DOCKER_SETUP.md](DOCKER_SETUP.md)
- **API Testing**: See [API_TESTING.md](API_TESTING.md)
- **Full README**: See [README.md](README.md)