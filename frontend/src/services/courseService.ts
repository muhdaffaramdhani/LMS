import api from '@/lib/axios';

export interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  image?: string;
  lecturer: number;
  lecturer_detail: {
    first_name: string;
    last_name: string;
    username: string;
  };
}

export const courseService = {
  getAll: async () => {
    const response = await api.get<Course[]>('/courses/');
    return response.data;
  },

  // Tambahan method getById
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
};