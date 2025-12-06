import api from '@/lib/axios';
import { Course } from './courseService';

export interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  course: number;
  course_detail: Course;
  created_at: string;
}

export interface CreateAssignmentData {
  title: string;
  description: string;
  due_date: string;
  course: number;
}

export const assignmentService = {
  getAll: async () => {
    const response = await api.get<Assignment[]>('/assignments/');
    return response.data;
  },

  create: async (data: CreateAssignmentData) => {
    const response = await api.post<Assignment>('/assignments/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateAssignmentData>) => {
    const response = await api.patch<Assignment>(`/assignments/${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/assignments/${id}/`);
  },
};