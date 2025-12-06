import api from '@/lib/axios';

interface TokenResponse {
  access: string;
  refresh: string;
}

interface LoginInput {
  username: string;
  password: string;
}

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  first_name: string; 
  last_name: string;
  role?: string;
}

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

export interface UserData {
  id: number;
  username: string;
  email?: string;
  role: 'student' | 'lecturer' | 'admin';
  first_name?: string;
  last_name?: string;
}

export const authService = {
  // LOGIN: Get Token -> Lalu Get User Profile (/users/me/)
  login: async (data: LoginInput) => {
    // 1. Dapat token dulu
    const response = await api.post<TokenResponse>('/token/', data);
    
    if (response.data.access) {
      localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh);
      
      // 2. Ambil data user asli dari endpoint /users/me/
      try {
        const userResponse = await api.get<UserData>('/users/me/');
        
        // Simpan data user yang akurat ke localStorage
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userResponse.data));
        
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Fallback hanya jika request gagal total (jarang terjadi)
        const dummyUser = { 
          username: data.username, 
          role: 'student', 
          id: 0, 
          first_name: data.username 
        };
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(dummyUser));
      }
    }
    return response.data;
  },

  register: async (data: RegisterInput) => {
    const response = await api.post('/users/', {
      ...data,
      role: data.role || 'student'
    });
    return response.data;
  },

  // Update Profile
  updateProfile: async (id: number, data: Partial<UserData> & { password?: string }) => {
    const response = await api.patch(`/users/${id}/`, data);
    // Update local storage
    const currentUser = authService.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem('taskStatuses');
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getUser: (): UserData | null => {
    const userStr = localStorage.getItem(USER_DATA_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Helper untuk Admin: Ambil semua user
  getAllUsers: async () => {
    const response = await api.get('/users/');
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
  }
};