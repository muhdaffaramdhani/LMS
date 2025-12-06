# Dummy Data Documentation

This document describes the test data automatically seeded into the database when you run the backend with Docker.

## Overview

The database is automatically populated with realistic dummy data including:
- **Users**: 1 Admin, 3 Lecturers, 10 Students
- **Courses**: 10 courses across different subjects
- **Enrollments**: Students enrolled in 3-5 courses each
- **Materials**: 3-5 materials per course (50+ total)
- **Assignments**: 3-4 assignments per course (40+ total)
- **Submissions**: Students have submitted 60-80% of their assignments
- **Discussions**: 5-8 discussion threads per course
- **Comments**: 2-6 comments per discussion thread

---

## User Credentials

### Admin User

**Username**: `admin`  
**Password**: `admin123`  
**Email**: `admin@eduplatform.com`  
**Role**: Admin  
**Permissions**: Full access to all features

### Lecturers

| Username | Password | Email | Name | Specialization |
|----------|----------|-------|------|----------------|
| `lecturer1` | `lecturer123` | lecturer1@eduplatform.com | Dr. Sarah Johnson | Computer Science & Web Development |
| `lecturer2` | `lecturer123` | lecturer2@eduplatform.com | Prof. Michael Chen | Data Science & Machine Learning |
| `lecturer3` | `lecturer123` | lecturer3@eduplatform.com | Dr. Emily Williams | Cybersecurity |

**Permissions**: Can create courses, assignments, materials, grade submissions

### Students

| Username | Password | Email | Name |
|----------|----------|-------|------|
| `student1` | `student123` | student1@eduplatform.com | John Doe |
| `student2` | `student123` | student2@eduplatform.com | Jane Smith |
| `student3` | `student123` | student3@eduplatform.com | Alice Brown |
| `student4` | `student123` | student4@eduplatform.com | Bob Wilson |
| `student5` | `student123` | student5@eduplatform.com | Charlie Davis |
| `student6` | `student123` | student6@eduplatform.com | Diana Martinez |
| `student7` | `student123` | student7@eduplatform.com | Ethan Garcia |
| `student8` | `student123` | student8@eduplatform.com | Fiona Rodriguez |
| `student9` | `student123` | student9@eduplatform.com | George Lee |
| `student10` | `student123` | student10@eduplatform.com | Hannah Taylor |

**Permissions**: Can enroll in courses, submit assignments, participate in discussions

---

## Courses

### Computer Science Track (Dr. Sarah Johnson)

#### CS101 - Introduction to Programming
- **Credits**: 3
- **Description**: Learn the fundamentals of programming using Python
- **Materials**: Lecture notes, video tutorials, coding examples
- **Assignments**: Basic programming exercises, control structures, functions

#### CS201 - Data Structures and Algorithms
- **Credits**: 4
- **Description**: Deep dive into data structures and algorithms
- **Materials**: Algorithm visualizations, complexity analysis guides
- **Assignments**: Implementation of data structures, algorithm design

#### CS301 - Web Development
- **Credits**: 4
- **Description**: Full-stack web development with modern frameworks
- **Materials**: HTML/CSS/JavaScript tutorials, React guides, Node.js examples
- **Assignments**: Build responsive websites, REST APIs, full-stack projects

#### SE101 - Software Engineering Principles
- **Credits**: 3
- **Description**: Software development lifecycle and best practices
- **Materials**: Agile methodology guides, version control tutorials
- **Assignments**: Team projects, code reviews, documentation

### Data Science Track (Prof. Michael Chen)

#### DS101 - Introduction to Data Science
- **Credits**: 3
- **Description**: Data science fundamentals with Python
- **Materials**: Pandas tutorials, NumPy guides, data visualization examples
- **Assignments**: Data cleaning, exploratory analysis, visualization projects

#### DS201 - Machine Learning
- **Credits**: 4
- **Description**: Supervised and unsupervised learning algorithms
- **Materials**: TensorFlow tutorials, scikit-learn examples, neural networks
- **Assignments**: Classification models, regression analysis, neural networks

#### DS301 - Big Data Analytics
- **Credits**: 4
- **Description**: Large-scale data processing with Hadoop and Spark
- **Materials**: Hadoop setup guides, Spark tutorials, cloud analytics
- **Assignments**: MapReduce jobs, real-time analytics, data warehousing

### Cybersecurity Track (Dr. Emily Williams)

#### CY101 - Cybersecurity Fundamentals
- **Credits**: 3
- **Description**: Introduction to cybersecurity principles
- **Materials**: Security protocols, cryptography basics, threat analysis
- **Assignments**: Security audits, encryption exercises, vulnerability assessment

#### CY201 - Ethical Hacking
- **Credits**: 4
- **Description**: Penetration testing and security auditing
- **Materials**: Kali Linux guides, penetration testing tools, case studies
- **Assignments**: Vulnerability scanning, exploit development, security reports

#### CY301 - Network Security
- **Credits**: 4
- **Description**: Advanced network security concepts
- **Materials**: Firewall configuration, IDS/IPS setup, VPN tutorials
- **Assignments**: Network security design, wireless security, cloud security

---

## Sample Data Details

### Enrollments
- Each student is enrolled in **3-5 randomly selected courses**
- Enrollment dates vary from 1-60 days ago
- **Total**: 30+ enrollments

### Materials
- **3-5 materials per course** including:
  - PDF lecture notes
  - Video tutorials
  - External resource links
  - Presentation slides
- Upload dates staggered over the past 50 days
- **Total**: 50+ materials

### Assignments
- **3-4 assignments per course**
- Due dates range from 7-30 days in the future
- Max scores: 50, 75, or 100 points
- Types include: exercises, projects, labs, quizzes
- **Total**: 40+ assignments

### Submissions
- Students have submitted **60-80% of their enrolled course assignments**
- **70% submitted on time**, 30% late
- **80% of submissions are graded** with scores ranging from 60-100%
- Each submission includes:
  - Text explanation
  - Score (if graded)
  - Feedback from instructor
  - Submission timestamp
- **Total**: Multiple submissions per student

### Discussions
- **5-8 discussion threads per course**
- Topics include:
  - Lecture questions
  - Assignment help
  - Study groups
  - Resource sharing
  - Project collaboration
  - Technical issues
- Created over the past 30 days
- **Total**: 50+ discussion threads

### Discussion Comments
- **2-6 comments per discussion**
- Mix of direct comments and replies
- 40% of comments are threaded replies
- Comments from students, lecturers, and admin
- Timestamps spread over 25 days
- **Total**: 100+ comments

---

## Data Relationships

### Student View Example (student1)
- **Enrolled in**: 4 courses (CS101, DS101, CY101, SE101)
- **Materials accessible**: 16 materials across enrolled courses
- **Assignments**: 13 assignments (3-4 per course)
- **Submissions**: 9-10 submitted (60-80%)
- **Graded**: 7-8 submissions with scores
- **Discussion participation**: Author of 3-5 threads, 5-10 comments

### Lecturer View Example (lecturer1)
- **Teaching**: CS101, CS201, CS301, SE101 (4 courses)
- **Students**: 15-25 enrolled students across all courses
- **Materials created**: 16-20 materials
- **Assignments created**: 13-16 assignments
- **Submissions to grade**: 80-120 submissions
- **Discussion monitoring**: 20-32 threads to moderate

### Admin View
- **Total users**: 14 (1 admin + 3 lecturers + 10 students)
- **Total courses**: 10
- **Total enrollments**: 30+
- **Total materials**: 50+
- **Total assignments**: 40+
- **Total submissions**: 150+
- **Total discussions**: 50+
- **Total comments**: 100+

---

## Manual Seeding

If you want to manually seed the database or reseed with fresh data:

### Using Docker

```bash
# Seed data
./seed.sh              # Mac/Linux
seed.bat               # Windows

# Or manually
docker-compose exec web python manage.py seed_data

# Clear existing data and reseed
docker-compose exec web python manage.py seed_data --clear
```

### Without Docker

```bash
# Activate your virtual environment first
python manage.py seed_data

# Clear and reseed
python manage.py seed_data --clear
```

---

## Testing Scenarios

### As a Student

1. **Login**: Use `student1` / `student123`
2. **View Courses**: See enrolled courses
3. **Access Materials**: Download lecture notes and resources
4. **Submit Assignment**: Submit work for pending assignments
5. **Check Grades**: View graded submissions and feedback
6. **Participate in Discussions**: Ask questions, reply to threads

### As a Lecturer

1. **Login**: Use `lecturer1` / `lecturer123`
2. **View My Courses**: See courses you're teaching
3. **Create Material**: Upload new learning resources
4. **Create Assignment**: Add new assignments with due dates
5. **Grade Submissions**: Review and grade student work
6. **Monitor Discussions**: Respond to student questions

### As an Admin

1. **Login**: Use `admin` / `admin123`
2. **User Management**: View all users, create new users
3. **Course Management**: Access all courses
4. **System Monitoring**: View all activities
5. **Admin Panel**: Access Django admin at `/admin/`

---

## API Testing Examples

### Get All Courses
```bash
curl http://localhost:8000/api/courses/
```

### Login as Student
```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"student123"}'
```

### Get Student Enrollments (with token)
```bash
curl http://localhost:8000/api/enrollments/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Course Materials
```bash
curl http://localhost:8000/api/materials/?course=1
```

### Get Assignments for a Course
```bash
curl http://localhost:8000/api/assignments/?course=1
```

---

## Resetting the Database

To start fresh with new dummy data:

```bash
# Stop containers and remove volumes
docker-compose down -v

# Start fresh (will auto-seed)
docker-compose up

# Or manually reseed
docker-compose exec web python manage.py seed_data --clear
```

---

## Notes

- All timestamps are realistic and varied
- Grades follow a normal distribution (60-100%)
- Enrollment patterns simulate real student behavior
- Discussion topics reflect common student questions
- Assignment due dates are in the future for testing
- Some submissions are late to test late submission handling
- Not all assignments are graded to simulate ongoing work

---

## Customization

You can customize the seed data by editing:
```
backend/users/management/commands/seed_data.py
```

Modify:
- Number of users per role
- Number of courses
- Assignment types and scores
- Discussion topics
- Enrollment patterns
- Submission rates

Then run:
```bash
docker-compose exec web python manage.py seed_data --clear
```

---

## Troubleshooting

### No Data After Starting

If data isn't seeded automatically:

```bash
# Check logs
docker-compose logs web

# Manually seed
docker-compose exec web python manage.py seed_data
```

### Duplicate Data Errors

If you see duplicate errors:

```bash
# Clear and reseed
docker-compose exec web python manage.py seed_data --clear
```

### Login Not Working

Make sure you're using the exact credentials:
- Username is case-sensitive
- Password: `admin123`, `lecturer123`, or `student123`

---

## Summary

The dummy data provides a fully populated educational platform for testing and development:

✅ **14 users** across 3 roles  
✅ **10 courses** with realistic content  
✅ **50+ materials** for learning  
✅ **40+ assignments** for practice  
✅ **150+ submissions** with grades  
✅ **50+ discussions** with engagement  
✅ **100+ comments** for community interaction  

**Everything is connected and ready to use!**

Start exploring at: http://localhost:8000/api/schema/swagger-ui/