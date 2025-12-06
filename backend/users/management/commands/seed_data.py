"""
Django management command to seed the database with dummy data.
Creates users for each role and populates all features with realistic test data.
"""

from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from assignments.models import Assignment, Submission
from courses.models import Course, Enrollment
from discussions.models import Discussion, DiscussionComment
from materials.models import Material
from users.models import User


class Command(BaseCommand):
    help = "Seeds the database with dummy data for all features"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing data before seeding",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write(self.style.WARNING("Clearing existing data..."))
            self.clear_data()

        self.stdout.write(self.style.SUCCESS("Starting data seeding..."))

        # Create users
        users = self.create_users()
        self.stdout.write(self.style.SUCCESS(f"✓ Created {len(users)} users"))

        # Create courses
        courses = self.create_courses(users["lecturers"])
        self.stdout.write(self.style.SUCCESS(f"✓ Created {len(courses)} courses"))

        # Create enrollments
        enrollments = self.create_enrollments(users["students"], courses)
        self.stdout.write(
            self.style.SUCCESS(f"✓ Created {len(enrollments)} enrollments")
        )

        # Create materials
        materials = self.create_materials(courses)
        self.stdout.write(self.style.SUCCESS(f"✓ Created {len(materials)} materials"))

        # Create assignments
        assignments = self.create_assignments(courses)
        self.stdout.write(
            self.style.SUCCESS(f"✓ Created {len(assignments)} assignments")
        )

        # Create submissions
        submissions = self.create_submissions(users["students"], assignments)
        self.stdout.write(
            self.style.SUCCESS(f"✓ Created {len(submissions)} submissions")
        )

        # Create discussions
        discussions = self.create_discussions(courses, users["students"])
        self.stdout.write(
            self.style.SUCCESS(f"✓ Created {len(discussions)} discussions")
        )

        # Create discussion comments
        comments = self.create_discussion_comments(discussions, users)
        self.stdout.write(
            self.style.SUCCESS(f"✓ Created {len(comments)} discussion comments")
        )

        self.stdout.write(self.style.SUCCESS("\n" + "=" * 60))
        self.stdout.write(
            self.style.SUCCESS("Database seeding completed successfully!")
        )
        self.stdout.write(self.style.SUCCESS("=" * 60))
        self.print_credentials(users)

    def clear_data(self):
        """Clear all existing data"""
        DiscussionComment.objects.all().delete()
        Discussion.objects.all().delete()
        Submission.objects.all().delete()
        Assignment.objects.all().delete()
        Material.objects.all().delete()
        Enrollment.objects.all().delete()
        Course.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

    def create_users(self):
        """Create users for each role"""
        users = {"admin": None, "lecturers": [], "students": []}

        # Create admin
        if not User.objects.filter(username="admin").exists():
            users["admin"] = User.objects.create_superuser(
                username="admin",
                email="admin@eduplatform.com",
                password="admin123",
                first_name="Admin",
                last_name="User",
                role="admin",
            )
        else:
            users["admin"] = User.objects.get(username="admin")

        # Create lecturers
        lecturer_data = [
            {
                "username": "lecturer1",
                "email": "lecturer1@eduplatform.com",
                "password": "lecturer123",
                "first_name": "Dr. Sarah",
                "last_name": "Johnson",
                "bio": "Professor of Computer Science with 15 years of experience in software engineering and web development.",
            },
            {
                "username": "lecturer2",
                "email": "lecturer2@eduplatform.com",
                "password": "lecturer123",
                "first_name": "Prof. Michael",
                "last_name": "Chen",
                "bio": "Data Science expert specializing in machine learning and artificial intelligence.",
            },
            {
                "username": "lecturer3",
                "email": "lecturer3@eduplatform.com",
                "password": "lecturer123",
                "first_name": "Dr. Emily",
                "last_name": "Williams",
                "bio": "Cybersecurity specialist with industry experience at major tech companies.",
            },
        ]

        for data in lecturer_data:
            if not User.objects.filter(username=data["username"]).exists():
                user = User.objects.create_user(
                    username=data["username"],
                    email=data["email"],
                    password=data["password"],
                    first_name=data["first_name"],
                    last_name=data["last_name"],
                    role="lecturer",
                    bio=data["bio"],
                )
                users["lecturers"].append(user)
            else:
                users["lecturers"].append(User.objects.get(username=data["username"]))

        # Create students
        student_data = [
            {
                "username": "student1",
                "email": "student1@eduplatform.com",
                "password": "student123",
                "first_name": "John",
                "last_name": "Doe",
                "bio": "Computer Science major interested in full-stack development.",
            },
            {
                "username": "student2",
                "email": "student2@eduplatform.com",
                "password": "student123",
                "first_name": "Jane",
                "last_name": "Smith",
                "bio": "Software Engineering student passionate about AI and machine learning.",
            },
            {
                "username": "student3",
                "email": "student3@eduplatform.com",
                "password": "student123",
                "first_name": "Alice",
                "last_name": "Brown",
                "bio": "Data Science enthusiast with a background in mathematics.",
            },
            {
                "username": "student4",
                "email": "student4@eduplatform.com",
                "password": "student123",
                "first_name": "Bob",
                "last_name": "Wilson",
                "bio": "Cybersecurity student interested in ethical hacking.",
            },
            {
                "username": "student5",
                "email": "student5@eduplatform.com",
                "password": "student123",
                "first_name": "Charlie",
                "last_name": "Davis",
                "bio": "Web development enthusiast learning modern frameworks.",
            },
            {
                "username": "student6",
                "email": "student6@eduplatform.com",
                "password": "student123",
                "first_name": "Diana",
                "last_name": "Martinez",
                "bio": "Mobile app developer focusing on cross-platform solutions.",
            },
            {
                "username": "student7",
                "email": "student7@eduplatform.com",
                "password": "student123",
                "first_name": "Ethan",
                "last_name": "Garcia",
                "bio": "Database administrator in training.",
            },
            {
                "username": "student8",
                "email": "student8@eduplatform.com",
                "password": "student123",
                "first_name": "Fiona",
                "last_name": "Rodriguez",
                "bio": "Cloud computing enthusiast working with AWS and Azure.",
            },
            {
                "username": "student9",
                "email": "student9@eduplatform.com",
                "password": "student123",
                "first_name": "George",
                "last_name": "Lee",
                "bio": "Game development student creating indie games.",
            },
            {
                "username": "student10",
                "email": "student10@eduplatform.com",
                "password": "student123",
                "first_name": "Hannah",
                "last_name": "Taylor",
                "bio": "UX/UI designer learning front-end development.",
            },
        ]

        for data in student_data:
            if not User.objects.filter(username=data["username"]).exists():
                user = User.objects.create_user(
                    username=data["username"],
                    email=data["email"],
                    password=data["password"],
                    first_name=data["first_name"],
                    last_name=data["last_name"],
                    role="student",
                    bio=data["bio"],
                )
                users["students"].append(user)
            else:
                users["students"].append(User.objects.get(username=data["username"]))

        return users

    def create_courses(self, lecturers):
        """Create courses"""
        courses = []

        course_data = [
            {
                "code": "CS101",
                "title": "Introduction to Programming",
                "description": "Learn the fundamentals of programming using Python. This course covers variables, data types, control structures, functions, and basic object-oriented programming concepts.",
                "credits": 3,
                "lecturer": lecturers[0],
            },
            {
                "code": "CS201",
                "title": "Data Structures and Algorithms",
                "description": "Deep dive into essential data structures (arrays, linked lists, trees, graphs) and algorithms (sorting, searching, dynamic programming). Includes complexity analysis and problem-solving techniques.",
                "credits": 4,
                "lecturer": lecturers[0],
            },
            {
                "code": "CS301",
                "title": "Web Development",
                "description": "Comprehensive web development course covering HTML, CSS, JavaScript, React, Node.js, and databases. Build full-stack web applications from scratch.",
                "credits": 4,
                "lecturer": lecturers[0],
            },
            {
                "code": "DS101",
                "title": "Introduction to Data Science",
                "description": "Explore data science fundamentals including data analysis, visualization, statistics, and basic machine learning using Python libraries like Pandas, NumPy, and Matplotlib.",
                "credits": 3,
                "lecturer": lecturers[1],
            },
            {
                "code": "DS201",
                "title": "Machine Learning",
                "description": "Study supervised and unsupervised learning algorithms, neural networks, and deep learning. Hands-on projects using TensorFlow and scikit-learn.",
                "credits": 4,
                "lecturer": lecturers[1],
            },
            {
                "code": "DS301",
                "title": "Big Data Analytics",
                "description": "Work with large-scale data processing using Hadoop, Spark, and cloud-based analytics platforms. Learn data warehousing and real-time analytics.",
                "credits": 4,
                "lecturer": lecturers[1],
            },
            {
                "code": "CY101",
                "title": "Cybersecurity Fundamentals",
                "description": "Introduction to cybersecurity principles, network security, cryptography, and threat analysis. Learn to protect systems and data from cyber attacks.",
                "credits": 3,
                "lecturer": lecturers[2],
            },
            {
                "code": "CY201",
                "title": "Ethical Hacking",
                "description": "Hands-on course in penetration testing, vulnerability assessment, and security auditing. Learn ethical hacking techniques to identify and fix security flaws.",
                "credits": 4,
                "lecturer": lecturers[2],
            },
            {
                "code": "CY301",
                "title": "Network Security",
                "description": "Advanced network security covering firewalls, IDS/IPS, VPNs, and secure network design. Includes wireless security and cloud security.",
                "credits": 4,
                "lecturer": lecturers[2],
            },
            {
                "code": "SE101",
                "title": "Software Engineering Principles",
                "description": "Learn software development lifecycle, agile methodologies, version control, testing, and project management. Build real-world applications in teams.",
                "credits": 3,
                "lecturer": lecturers[0],
            },
        ]

        for data in course_data:
            course, created = Course.objects.get_or_create(
                code=data["code"], defaults=data
            )
            courses.append(course)

        return courses

    def create_enrollments(self, students, courses):
        """Create enrollments"""
        enrollments = []

        # Enroll each student in 3-5 courses
        for student in students:
            import random

            num_courses = random.randint(3, 5)
            student_courses = random.sample(courses, num_courses)

            for course in student_courses:
                enrollment, created = Enrollment.objects.get_or_create(
                    student=student,
                    course=course,
                    defaults={
                        "enrolled_at": timezone.now()
                        - timedelta(days=random.randint(1, 60))
                    },
                )
                enrollments.append(enrollment)

        return enrollments

    def create_materials(self, courses):
        """Create course materials"""
        materials = []

        material_types = ["pdf", "video", "link", "document"]

        for course in courses:
            # Create 3-5 materials per course
            for i in range(1, 6):
                import random

                material_type = random.choice(material_types)

                titles = {
                    "pdf": [
                        f"{course.title} - Lecture {i} Notes",
                        f"{course.title} - Chapter {i} Summary",
                        f"{course.title} - Study Guide {i}",
                    ],
                    "video": [
                        f"{course.title} - Video Lecture {i}",
                        f"{course.title} - Tutorial {i}",
                        f"{course.title} - Demo {i}",
                    ],
                    "link": [
                        f"{course.title} - External Resource {i}",
                        f"{course.title} - Reference {i}",
                        f"{course.title} - Documentation {i}",
                    ],
                    "document": [
                        f"{course.title} - Slides {i}",
                        f"{course.title} - Handout {i}",
                        f"{course.title} - Reading {i}",
                    ],
                }

                descriptions = {
                    "pdf": "Comprehensive lecture notes covering key concepts and examples.",
                    "video": "Video tutorial explaining concepts with practical demonstrations.",
                    "link": "External resource for additional reading and reference.",
                    "document": "Presentation slides and supplementary materials.",
                }

                material = Material.objects.create(
                    course=course,
                    title=random.choice(titles[material_type]),
                    description=descriptions[material_type],
                    material_type=material_type,
                    content=f"Sample content for {course.title} - Material {i}",
                    order=i,
                    uploaded_at=timezone.now() - timedelta(days=random.randint(1, 50)),
                )
                materials.append(material)

        return materials

    def create_assignments(self, courses):
        """Create assignments"""
        assignments = []

        for course in courses:
            # Create 3-4 assignments per course
            for i in range(1, 5):
                import random

                assignment_titles = [
                    f"{course.title} - Assignment {i}",
                    f"{course.title} - Project {i}",
                    f"{course.title} - Lab {i}",
                    f"{course.title} - Quiz {i}",
                ]

                descriptions = [
                    f"Complete the exercises and submit your solution. This assignment covers topics from lectures {i}-{i + 1}.",
                    f"Implement the required functionality and write comprehensive tests. Include documentation.",
                    f"Practical lab exercise to reinforce concepts learned in class. Show all work.",
                    f"Answer all questions and provide detailed explanations. No collaboration allowed.",
                ]

                days_until_due = random.randint(7, 30)
                max_score = random.choice([50, 75, 100])

                assignment = Assignment.objects.create(
                    course=course,
                    title=random.choice(assignment_titles),
                    description=random.choice(descriptions),
                    due_date=timezone.now() + timedelta(days=days_until_due),
                    max_score=max_score,
                    created_at=timezone.now() - timedelta(days=random.randint(1, 40)),
                )
                assignments.append(assignment)

        return assignments

    def create_submissions(self, students, assignments):
        """Create assignment submissions"""
        submissions = []

        import random

        for student in students:
            # Get courses the student is enrolled in
            enrolled_courses = Enrollment.objects.filter(student=student).values_list(
                "course", flat=True
            )
            student_assignments = [
                a for a in assignments if a.course_id in enrolled_courses
            ]

            # Submit 60-80% of assignments
            num_submissions = int(len(student_assignments) * random.uniform(0.6, 0.8))
            assignments_to_submit = random.sample(student_assignments, num_submissions)

            for assignment in assignments_to_submit:
                # 70% submitted on time, 30% late
                if random.random() < 0.7:
                    submitted_at = timezone.now() - timedelta(days=random.randint(1, 7))
                else:
                    submitted_at = assignment.due_date + timedelta(
                        days=random.randint(1, 5)
                    )

                text_submissions = [
                    f"I have completed the assignment. Please find my solution attached.",
                    f"Here is my submission for {assignment.title}. I have implemented all required features.",
                    f"Assignment completed. All tests are passing.",
                    f"Please review my work. I followed all the guidelines.",
                ]

                submission = Submission.objects.create(
                    assignment=assignment,
                    student=student,
                    text_submission=random.choice(text_submissions),
                    submitted_at=submitted_at,
                )

                # Grade 80% of submissions
                if random.random() < 0.8:
                    score = random.randint(
                        int(assignment.max_score * 0.6), assignment.max_score
                    )
                    submission.score = score

                    feedback_options = [
                        f"Good work! Score: {score}/{assignment.max_score}",
                        f"Well done. You demonstrated understanding of the concepts.",
                        f"Nice implementation. Consider optimizing the solution.",
                        f"Excellent work! Keep it up.",
                        f"Good effort. Review the feedback comments for improvement.",
                    ]
                    submission.feedback = random.choice(feedback_options)
                    submission.graded_at = submitted_at + timedelta(
                        days=random.randint(1, 5)
                    )
                    submission.save()

                submissions.append(submission)

        return submissions

    def create_discussions(self, courses, students):
        """Create discussion threads"""
        discussions = []

        import random

        discussion_topics = [
            (
                "Question about Lecture {i}",
                "Can someone explain the concept covered in lecture {i}? I'm having trouble understanding it.",
            ),
            (
                "Help with Assignment {i}",
                "I'm stuck on question {i} of the assignment. Any hints?",
            ),
            (
                "Study Group for Exam",
                "Anyone interested in forming a study group for the upcoming exam?",
            ),
            (
                "Interesting Article",
                "Found this interesting article related to our course. What do you think?",
            ),
            (
                "Project Collaboration",
                "Looking for team members for the final project. Any takers?",
            ),
            (
                "Clarification Needed",
                "The instructions for the project are a bit unclear. Can the instructor clarify?",
            ),
            (
                "Resource Recommendation",
                "Can anyone recommend good resources for learning this topic in more depth?",
            ),
            (
                "Discussion: Best Practices",
                "What are some best practices you follow when working on projects?",
            ),
            (
                "Career Advice",
                "How can we apply what we're learning to real-world scenarios?",
            ),
            (
                "Technical Issue",
                "I'm getting an error when running the code. Has anyone else encountered this?",
            ),
        ]

        for course in courses:
            # Create 5-8 discussions per course
            num_discussions = random.randint(5, 8)

            for i in range(num_discussions):
                title_template, content_template = random.choice(discussion_topics)
                title = title_template.format(i=random.randint(1, 5))
                content = content_template.format(i=random.randint(1, 5))

                author = random.choice(students)

                discussion = Discussion.objects.create(
                    course=course,
                    author=author,
                    title=title,
                    content=content,
                    created_at=timezone.now() - timedelta(days=random.randint(1, 30)),
                )
                discussions.append(discussion)

        return discussions

    def create_discussion_comments(self, discussions, users):
        """Create discussion comments"""
        comments = []

        import random

        all_users = users["students"] + users["lecturers"] + [users["admin"]]

        comment_templates = [
            "Great question! I had the same issue.",
            "Here's what I found helpful: {info}",
            "I think the key concept here is {concept}.",
            "Have you tried {suggestion}?",
            "Let me explain this in a different way...",
            "The documentation mentions {detail}.",
            "I would approach this by {approach}.",
            "That's a good point. Additionally, {addition}.",
            "Thanks for sharing! This is really helpful.",
            "I'm also interested in this topic.",
        ]

        for discussion in discussions:
            # Create 2-6 comments per discussion
            num_comments = random.randint(2, 6)

            for i in range(num_comments):
                author = random.choice(all_users)

                template = random.choice(comment_templates)
                content = template.format(
                    info="checking the documentation",
                    concept="understanding the underlying principles",
                    suggestion="breaking it down into smaller steps",
                    detail="some useful information",
                    approach="starting with the basics",
                    addition="you should also consider this aspect",
                )

                # Some comments are replies
                parent = None
                if i > 0 and random.random() < 0.4:  # 40% chance of being a reply
                    parent = random.choice(comments[-i:]) if comments else None

                comment = DiscussionComment.objects.create(
                    discussion=discussion,
                    author=author,
                    content=content,
                    parent=parent,
                    created_at=timezone.now() - timedelta(days=random.randint(1, 25)),
                )
                comments.append(comment)

        return comments

    def print_credentials(self, users):
        """Print user credentials"""
        self.stdout.write("\n" + "=" * 60)
        self.stdout.write(self.style.SUCCESS("TEST USER CREDENTIALS"))
        self.stdout.write("=" * 60 + "\n")

        self.stdout.write(self.style.WARNING("ADMIN:"))
        self.stdout.write(f"  Username: admin")
        self.stdout.write(f"  Password: admin123")
        self.stdout.write(f"  Email: admin@eduplatform.com\n")

        self.stdout.write(self.style.WARNING("LECTURERS:"))
        for i in range(1, 4):
            self.stdout.write(f"  Username: lecturer{i}")
            self.stdout.write(f"  Password: lecturer123")
            self.stdout.write(f"  Email: lecturer{i}@eduplatform.com\n")

        self.stdout.write(self.style.WARNING("STUDENTS:"))
        for i in range(1, 11):
            self.stdout.write(f"  Username: student{i}")
            self.stdout.write(f"  Password: student123")
            self.stdout.write(f"  Email: student{i}@eduplatform.com")

        self.stdout.write("\n" + "=" * 60)
        self.stdout.write(self.style.SUCCESS("Access the application:"))
        self.stdout.write("  API: http://localhost:8000/api/")
        self.stdout.write("  Admin Panel: http://localhost:8000/admin/")
        self.stdout.write("  API Docs: http://localhost:8000/api/schema/swagger-ui/")
        self.stdout.write("=" * 60 + "\n")
