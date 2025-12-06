# EduPlatform - Educational Platform Backend

A comprehensive RESTful API backend for an educational platform built with Django REST Framework.

## ✨ Features

- 🔐 **JWT Authentication** with role-based access control
- 👥 **User Roles**: Admin, Lecturer, Student with distinct permissions
- 📚 **Course Management**: Create, manage, and enroll in courses
- 📄 **Materials**: Upload and share learning resources
- 📝 **Assignments**: Create assignments with grading system
- 💬 **Discussion Forums**: Threaded discussions and comments
- 🔄 **Enrollments**: Student course registration system
- 📊 **API Documentation**: Interactive Swagger/ReDoc interface
- 🐳 **Docker Support**: Zero-config setup with Docker Compose
- 🌱 **Dummy Data**: 14+ test users and 10 courses pre-loaded

## 🚀 Quick Start (Recommended)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed
- That's it! No Python, PostgreSQL, or other dependencies needed.

### Start the Backend

**Windows:**
```bash
cd backend
start.bat
```

**Mac/Linux:**
```bash
cd backend
./start.sh
```

**Or manually:**
```bash
cd backend
docker-compose up
```

### Access the API

- **API Root**: http://localhost:8000/api/
- **Swagger Docs**: http://localhost:8000/api/schema/swagger-ui/
- **ReDoc**: http://localhost:8000/api/schema/redoc/
- **Admin Panel**: http://localhost:8000/admin/

## 🔑 Test Credentials

The database comes pre-loaded with test users:

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |
| **Lecturers** | `lecturer1`, `lecturer2`, `lecturer3` | `lecturer123` |
| **Students** | `student1` through `student10` | `student123` |

## 📊 What's Included

Automatically seeded dummy data:

- ✅ **14 Users** - 1 Admin, 3 Lecturers, 10 Students
- ✅ **10 Courses** - Computer Science, Data Science, Cybersecurity tracks
- ✅ **50+ Materials** - Lecture notes, videos, slides, links
- ✅ **40+ Assignments** - Projects, quizzes, labs with due dates
- ✅ **150+ Submissions** - Student work with grades and feedback
- ✅ **50+ Discussions** - Active forum threads
- ✅ **100+ Comments** - Threaded discussions and replies

## 🛠️ Tech Stack

- **Django 5.1.6** - Web framework
- **Django REST Framework 3.15.2** - API framework
- **PostgreSQL 15** - Database
- **JWT** - Authentication (djangorestframework-simplejwt)
- **Docker & Docker Compose** - Containerization
- **Gunicorn** - WSGI server (production)
- **WhiteNoise** - Static file serving
- **drf-spectacular** - API documentation

## 📚 Documentation

All documentation is located in the `backend/` directory:

| Document | Description |
|----------|-------------|
| **[DOCKER_SETUP.md](backend/DOCKER_SETUP.md)** | Complete Docker setup and usage guide |
| **[DUMMY_DATA.md](backend/DUMMY_DATA.md)** | Test data and credentials details |
| **[FRONTEND_INTEGRATION.md](backend/FRONTEND_INTEGRATION.md)** | Frontend integration examples (React, Vue, Angular) |
| **[QUICK_REFERENCE.md](backend/QUICK_REFERENCE.md)** | Common commands and troubleshooting |
| **[API_TESTING.md](backend/API_TESTING.md)** | API testing guide |
| **[CHANGELOG.md](backend/CHANGELOG.md)** | Version history and updates |

## 🔄 Common Tasks

### Reseed Database

```bash
cd backend
./seed.sh              # Mac/Linux
seed.bat               # Windows
```

### Create Admin User

```bash
cd backend
./create-admin.sh      # Mac/Linux
create-admin.bat       # Windows
```

### View Logs

```bash
cd backend
docker-compose logs -f web
```

### Stop Services

```bash
cd backend
docker-compose down
```

### Reset Everything

```bash
cd backend
docker-compose down -v
docker-compose up --build
```

## 📡 API Endpoints

### Authentication
- `POST /api/users/login/` - Login (get JWT tokens)
- `POST /api/users/register/` - Register new user
- `POST /api/users/token/refresh/` - Refresh access token

### Resources
- `/api/users/` - User management
- `/api/courses/` - Course management
- `/api/enrollments/` - Course enrollments
- `/api/materials/` - Course materials
- `/api/assignments/` - Assignments
- `/api/submissions/` - Student submissions
- `/api/discussions/` - Discussion forums
- `/api/discussion-comments/` - Discussion comments

## 🎯 Role-Based Permissions

### Admin
- Full access to all resources
- User management
- System configuration

### Lecturer
- Create and manage own courses
- Upload materials
- Create assignments
- Grade student submissions
- Moderate discussions

### Student
- Enroll in courses
- Access materials
- Submit assignments
- Participate in discussions

## 🧪 Frontend Integration

### Quick Example

```javascript
// Login
const response = await fetch('http://localhost:8000/api/users/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'student1', password: 'student123' })
});
const { access, refresh } = await response.json();

// Get courses
const courses = await fetch('http://localhost:8000/api/courses/', {
  headers: { 'Authorization': `Bearer ${access}` }
});
```

See **[FRONTEND_INTEGRATION.md](backend/FRONTEND_INTEGRATION.md)** for complete React, Vue, and Angular examples.

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

### Database Connection Error

```bash
cd backend
docker-compose down -v
docker-compose up
```

### No Dummy Data

```bash
cd backend
docker-compose exec web python manage.py seed_data
```

## 🔐 Security Notes

**Development Mode (Current Settings)**
- ⚠️ CORS allows all origins
- ⚠️ Debug mode enabled
- ⚠️ Default credentials are public
- ⚠️ Insecure secret key

**For Production:**
- Change `SECRET_KEY` to secure random string
- Set `DEBUG=False`
- Configure specific `ALLOWED_HOSTS`
- Set specific `CORS_ALLOWED_ORIGINS`
- Use strong database passwords
- Enable HTTPS
- Use environment variables

## 📝 Manual Setup (Without Docker)

If you prefer not to use Docker:

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup PostgreSQL

```sql
CREATE DATABASE eduplatform;
CREATE USER eduplatform_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE eduplatform TO eduplatform_user;
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Migrate Database

```bash
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Seed Data (Optional)

```bash
python manage.py seed_data
```

### 7. Run Server

```bash
python manage.py runserver
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

- **Documentation**: See the `backend/` directory for detailed guides
- **API Docs**: http://localhost:8000/api/schema/swagger-ui/
- **Test API**: Run `cd backend && ./test-api.sh`
- **Reset**: `cd backend && docker-compose down -v && docker-compose up`

## 🎓 Project Structure

```
backend/
├── assignments/          # Assignment app
├── courses/             # Course management app
├── discussions/         # Discussion forum app
├── eduplatform/         # Main Django project
├── materials/           # Course materials app
├── users/               # User management app
├── docker-compose.yml   # Docker Compose config
├── Dockerfile           # Production Docker image
├── Dockerfile.dev       # Development Docker image
├── requirements.txt     # Python dependencies
├── manage.py           # Django management script
└── *.sh / *.bat        # Helper scripts
```

## ⚡ Quick Commands Reference

```bash
# Start backend
cd backend && docker-compose up

# Stop backend
cd backend && docker-compose down

# View logs
cd backend && docker-compose logs -f

# Reseed data
cd backend && ./seed.sh

# Create admin
cd backend && ./create-admin.sh

# Django shell
cd backend && docker-compose exec web python manage.py shell

# Run tests
cd backend && docker-compose exec web python manage.py test
```

## 🌟 Highlights

- **Zero Configuration**: Docker handles everything
- **Instant Data**: Pre-loaded with realistic test data
- **Production Ready**: Gunicorn + PostgreSQL + Docker
- **Well Documented**: 2000+ lines of documentation
- **Frontend Friendly**: CORS configured, detailed integration examples
- **Easy Testing**: Multiple test users for all roles
- **Developer Friendly**: Hot-reload, helper scripts, clear error messages

---

**Made with ❤️ for educational purposes**

Visit the [API Documentation](http://localhost:8000/api/schema/swagger-ui/) after starting the server!