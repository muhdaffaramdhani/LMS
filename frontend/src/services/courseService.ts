import api from '@/lib/axios';
import { UserData } from './authService';

export interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  lecturer: number;
  lecturer_detail?: UserData;
  duration_weeks?: number;
  image?: string;
  students_count?: number;
  is_enrolled?: boolean; // Tambahan penting dari serializer baru
}

export const courseService = {
  // Get All (Bisa filter enrolled atau search)
  getAll: async (params?: { enrolled?: boolean; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.enrolled) query.append('enrolled', 'true');
    if (params?.search) query.append('search', params.search);
    
    const response = await api.get<Course[]>(`/courses/?${query.toString()}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Course>(`/courses/${id}/`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await api.post('/courses/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: FormData) => {
    const response = await api.patch(`/courses/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/courses/${id}/`);
    return response.data;
  },

  // Fitur Baru: Enroll
  enroll: async (courseId: number) => {
    // Memanggil endpoint action custom yang kita buat di backend
    const response = await api.post(`/courses/${courseId}/enroll/`);
    return response.data;
  }
};