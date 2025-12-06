import api from '@/lib/axios';

export interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  image?: string;
  duration_weeks?: number;
  lecturer: number;
  lecturer_detail: {
    first_name: string;
    last_name: string;
    username: string;
  };
  students_count?: number;
}

export interface Enrollment {
  id: number;
  student: number;
  course: number;
  student_detail?: any;
}

export const courseService = {
  getAll: async () => {
    const response = await api.get<Course[]>('/courses/');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Course>(`/courses/${id}/`);
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await api.post<Course>('/courses/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, formData: FormData) => {
    const response = await api.patch<Course>(`/courses/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/courses/${id}/`);
  },

  // Enrollments
  enrollStudent: async (courseId: number, studentId?: number) => {
    // If studentId is not provided, backend might use current user (if logic exists) 
    // or we pass the current user's ID from frontend context.
    // Standard endpoint: POST /enrollments/ { course: 1, student: 2 }
    const payload: any = { course: courseId };
    if (studentId) payload.student = studentId;
    
    const response = await api.post('/enrollments/', payload);
    return response.data;
  },

  checkEnrollment: async () => {
    // Get all enrollments for current user to check status
    const response = await api.get('/enrollments/');
    return response.data;
  }
};