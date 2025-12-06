import api from '@/lib/axios';

export interface Report {
  id: number;
  title: string;
  content: string;
  week_number: number;
  progress_percentage: number;
  created_at: string;
  user_detail?: {
    username: string;
    first_name: string;
    last_name: string;
  };
}

export interface CreateReportData {
  title: string;
  content: string;
  week_number: number;
  progress_percentage: number;
}

export const reportService = {
  // GET: Ambil semua laporan
  getAll: async () => {
    const response = await api.get<Report[]>('/reports/');
    return response.data;
  },
  
  // POST: Buat laporan baru
  create: async (data: CreateReportData) => {
    const response = await api.post<Report>('/reports/', data);
    return response.data;
  },

  // PUT/PATCH: Update laporan
  update: async (id: number, data: Partial<CreateReportData>) => {
    const response = await api.patch<Report>(`/reports/${id}/`, data);
    return response.data;
  },

  // DELETE: Hapus laporan
  delete: async (id: number) => {
    await api.delete(`/reports/${id}/`);
  },
};