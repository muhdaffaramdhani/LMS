from django.db import models
from django.conf import settings

class Course(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField()
    lecturer = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        limit_choices_to={'role': 'lecturer'},
        related_name='teaching_courses'
    )
    duration_weeks = models.IntegerField(default=12)
    image = models.ImageField(upload_to='courses/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Enrollment(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='enrollments' # PENTING untuk filtering user.enrollments
    )
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        related_name='enrollments' # PENTING untuk filtering course.enrollments
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['student', 'course'] # Mencegah double enroll
        ordering = ['-enrolled_at']

    def __str__(self):
        return f"{self.student.username} -> {self.course.code}"