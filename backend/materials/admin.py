from django.contrib import admin
from .models import Material


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'created_at')
    list_filter = ('created_at', 'course')
    search_fields = ('title', 'course__name', 'course__code')
    date_hierarchy = 'created_at'
