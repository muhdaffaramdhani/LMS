from django.db import models
from django.conf import settings
from courses.models import Course


class Discussion(models.Model):
    """Discussion Model"""
    title = models.CharField(max_length=150)
    content = models.TextField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='discussions'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='discussions'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'discussions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.course.code}"


class DiscussionComment(models.Model):
    """Discussion Comment Model"""
    discussion = models.ForeignKey(
        Discussion,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='discussion_comments'
    )
    content = models.TextField()
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'discussion_comments'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.user.username} on {self.discussion.title}"
