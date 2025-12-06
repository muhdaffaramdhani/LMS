from django.contrib import admin
from .models import Discussion, DiscussionComment


@admin.register(Discussion)
class DiscussionAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'course', 'created_at')
    list_filter = ('created_at', 'course')
    search_fields = ('title', 'content', 'user__username', 'course__name')
    date_hierarchy = 'created_at'


@admin.register(DiscussionComment)
class DiscussionCommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'discussion', 'parent', 'created_at')
    list_filter = ('created_at', 'discussion__course')
    search_fields = ('content', 'user__username', 'discussion__title')
    date_hierarchy = 'created_at'
