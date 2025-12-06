from django.db import models
from courses.models import Course


class Material(models.Model):
    """Course Material Model"""
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='materials'
    )
    title = models.CharField(max_length=150)
    file_url = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'materials'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.course.code}"
