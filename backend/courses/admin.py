from django.contrib import admin
from .models import Course, Enrollment

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'lecturer', 'created_at')
    search_fields = ('name', 'code')
    list_filter = ('created_at',)

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'enrolled_at')
    list_filter = ('enrolled_at',)
    search_fields = ('student__username', 'course__name')