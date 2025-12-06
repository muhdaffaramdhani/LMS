from django.contrib import admin
from .models import Assignment, Submission


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'due_date', 'created_at')
    list_filter = ('created_at', 'due_date', 'course')
    search_fields = ('title', 'description', 'course__name', 'course__code')
    date_hierarchy = 'created_at'


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('student', 'assignment', 'submitted_at', 'grade')
    list_filter = ('submitted_at', 'grade', 'assignment__course')
    search_fields = ('student__username', 'assignment__title')
    date_hierarchy = 'submitted_at'
