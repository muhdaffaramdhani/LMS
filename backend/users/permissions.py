from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Permission untuk admin
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'admin'
        )


class IsLecturer(BasePermission):
    """
    Permission untuk dosen/lecturer
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'lecturer'
        )


class IsStudent(BasePermission):
    """
    Permission untuk mahasiswa/student
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'student'
        )


class IsLecturerOrAdmin(BasePermission):
    """
    Permission untuk dosen atau admin
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['lecturer', 'admin']
        )


class IsOwnerOrAdmin(BasePermission):
    """
    Permission untuk owner object atau admin
    """
    def has_object_permission(self, request, view, obj):
        # Admin dapat mengakses semua
        if request.user.role == 'admin':
            return True
        
        # === COURSE ===
        # Pemilik: Dosen yang mengajar (lecturer)
        if hasattr(obj, 'lecturer'):
            return obj.lecturer == request.user
        
        # === SUBMISSION ===
        # Pemilik: Mahasiswa yang submit (student)
        if hasattr(obj, 'student'):
            return obj.student == request.user
        
        # === ASSIGNMENT & MATERIAL ===
        # Pemilik: Dosen yang mengajar course tersebut
        if hasattr(obj, 'course'):
            return obj.course.lecturer == request.user
        
        return False


class IsCourseOwner(BasePermission):
    """
    Permission khusus untuk lecturer pemilik course
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        
        # Untuk Course langsung
        if hasattr(obj, 'lecturer'):
            return obj.lecturer == request.user
        
        # Untuk Assignment/Material yang punya course
        if hasattr(obj, 'course'):
            return obj.course.lecturer == request.user
        
        return False


class IsSubmissionOwner(BasePermission):
    """
    Permission khusus untuk mahasiswa pemilik submission
    Atau lecturer dari course tersebut (untuk grading)
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        
        # Mahasiswa pemilik submission
        if hasattr(obj, 'student') and obj.student == request.user:
            return True
        
        # Lecturer dari course assignment tersebut (untuk grading)
        if hasattr(obj, 'assignment'):
            return obj.assignment.course.lecturer == request.user
        
        return False


class IsDiscussionOwner(BasePermission):
    """
    Permission untuk pemilik discussion atau comment
    """
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
            
        if request.user.role == 'admin':
            return True
        
        # Untuk Discussion atau Comment
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False
