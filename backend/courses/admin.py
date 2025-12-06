from django.contrib import admin
from .models import Course, Enrollment


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'lecturer', 'created_at')
    list_filter = ('created_at', 'lecturer')
    search_fields = ('name', 'code', 'description')
    date_hierarchy = 'created_at'


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'created_at')
    list_filter = ('created_at', 'course')
    search_fields = ('student__username', 'course__name', 'course__code')
    date_hierarchy = 'created_at'
