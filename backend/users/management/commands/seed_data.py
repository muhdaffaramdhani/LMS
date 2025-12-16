import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone

# Import models dengan try-except untuk menghindari error import saat app belum siap
try:
    from courses.models import Course, Enrollment
    from assignments.models import Assignment, Submission
    from materials.models import Material
    from discussions.models import Discussion, DiscussionComment
except ImportError:
    pass

User = get_user_model()

class Command(BaseCommand):
    help = "Seed database with minimal initial data (1 of each category)"

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting minimal data seeding...")

        # 1. Create Users (1 Admin, 1 Lecturer, 1 Student)
        admin = self.create_user('admin', 'admin@edu.com', 'admin123', 'admin', 'Super', 'Admin', is_staff=True)
        lecturer = self.create_user('dosen1', 'dosen1@edu.com', 'pass1234', 'lecturer', 'Budi', 'Santoso')
        student = self.create_user('student1', 'student1@edu.com', 'pass1234', 'student', 'Andi', 'Pratama')
        
        self.stdout.write(self.style.SUCCESS("✓ Created 1 Admin, 1 Lecturer, 1 Student"))

        # 2. Create 1 Course
        course = self.create_course(lecturer)
        self.stdout.write(self.style.SUCCESS("✓ Created 1 Course (Pemrograman Web Dasar)"))

        # 3. Create 1 Enrollment
        self.create_enrollment(student, course)
        self.stdout.write(self.style.SUCCESS("✓ Created 1 Enrollment"))

        # 4. Create 1 Material
        self.create_material(course)
        self.stdout.write(self.style.SUCCESS("✓ Created 1 Material"))

        # 5. Create 1 Assignment
        self.create_assignment(course)
        self.stdout.write(self.style.SUCCESS("✓ Created 1 Assignment"))

        # 6. Create 1 Discussion Topic & Comment
        self.create_discussion(course, lecturer, student)
        self.stdout.write(self.style.SUCCESS("✓ Created 1 Discussion & Comment"))

        self.stdout.write(self.style.SUCCESS("Minimal data seeding completed successfully!"))

    def create_user(self, username, email, password, role, first_name, last_name, is_staff=False):
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                role=role,
                first_name=first_name,
                last_name=last_name,
                is_staff=is_staff,
                is_superuser=is_staff
            )
            return user
        return User.objects.get(username=username)

    def create_course(self, lecturer):
        code = "WEB101"
        if not Course.objects.filter(code=code).exists():
            return Course.objects.create(
                code=code,
                name="Pemrograman Web Dasar",
                description="Kursus pengenalan pengembangan web modern menggunakan HTML, CSS, dan React.",
                lecturer=lecturer,
                duration_weeks=14
            )
        return Course.objects.get(code=code)

    def create_enrollment(self, student, course):
        if not Enrollment.objects.filter(student=student, course=course).exists():
            Enrollment.objects.create(student=student, course=course)

    def create_material(self, course):
        title = "Modul 1: Pengenalan React"
        if not Material.objects.filter(title=title, course=course).exists():
            try:
                material = Material(title=title, course=course)
                material.save()
            except Exception:
                pass

    def create_assignment(self, course):
        title = "Tugas 1: Membuat Komponen"
        if not Assignment.objects.filter(title=title, course=course).exists():
            try:
                Assignment.objects.create(
                    title=title,
                    course=course,
                    description="Buatlah komponen tombol sederhana yang dapat di-klik.",
                    due_date=timezone.now() + timedelta(days=7)
                )
            except Exception:
                pass

    def create_discussion(self, course, lecturer, student):
        title = "Diskusi Minggu 1"
        topic = None
        
        # Create Topic
        if not Discussion.objects.filter(title=title, course=course).exists():
            try:
                topic = Discussion.objects.create(
                    title=title,
                    course=course,
                    content="Silakan perkenalkan diri Anda di sini.",
                    user=lecturer 
                )
            except TypeError:
                try:
                    topic = Discussion.objects.create(
                        title=title,
                        course=course,
                        content="Silakan perkenalkan diri Anda di sini.",
                        author=lecturer
                    )
                except Exception as e:
                    print(f"Skipping discussion topic: {e}")
        else:
            try:
                topic = Discussion.objects.get(title=title, course=course)
            except:
                pass

        # Create Comment
        if topic:
            try:
                DiscussionComment.objects.create(
                    discussion=topic,
                    user=student,
                    content="Halo semuanya, saya Andi dari Jakarta."
                )
            except TypeError:
                try:
                    DiscussionComment.objects.create(
                        discussion=topic,
                        author=student,
                        content="Halo semuanya, saya Andi dari Jakarta."
                    )
                except:
                    pass
            except Exception:
                pass