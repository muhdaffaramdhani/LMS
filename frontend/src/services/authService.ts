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
  // LOGIN: Get Token -> Lalu Get User Profile
  login: async (data: LoginInput) => {
    // 1. Dapat token dulu
    const response = await api.post<TokenResponse>('/token/', data);
    
    if (response.data.access) {
      localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh);
      
      // 2. Ambil data user asli dari backend
      try {
        // Kita cari user berdasarkan username yang diinput
        const usersResponse = await api.get<UserData[]>('/users/');
        // Filter manual (karena backend /users/ mengembalikan list semua user)
        const currentUser = usersResponse.data.find(u => u.username === data.username);

        if (currentUser) {
           localStorage.setItem(USER_DATA_KEY, JSON.stringify(currentUser));
        } else {
           // Fallback jika gagal (jarang terjadi)
           const dummyUser = { username: data.username, role: 'student', id: 0 };
           localStorage.setItem(USER_DATA_KEY, JSON.stringify(dummyUser));
        }
      } catch (error) {
        console.error("Gagal mengambil profil user:", error);
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
    // Clear juga status tugas lokal
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

  setUserData: (data: UserData) => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
  }
};