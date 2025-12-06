# Frontend Integration Guide

This guide shows how to connect your frontend application to the EduPlatform backend API.

## Quick Start

The backend API runs at: **`http://localhost:8000/api/`**

All you need to do is:
1. Start the backend with Docker: `docker-compose up`
2. Make HTTP requests to the API endpoints
3. That's it! No CORS issues, no configuration needed.

---

## API Overview

### Base URL
```
http://localhost:8000/api/
```

### Authentication
The API uses JWT (JSON Web Token) authentication.

### Available Endpoints

| Endpoint | Methods | Description | Auth Required |
|----------|---------|-------------|---------------|
| `/api/users/` | GET, POST | User management | Partial |
| `/api/users/login/` | POST | Login (get JWT tokens) | No |
| `/api/users/register/` | POST | Register new user | No |
| `/api/courses/` | GET, POST, PUT, DELETE | Course management | Partial |
| `/api/enrollments/` | GET, POST, DELETE | Course enrollments | Yes |
| `/api/materials/` | GET, POST, PUT, DELETE | Course materials | Partial |
| `/api/assignments/` | GET, POST, PUT, DELETE | Assignments | Partial |
| `/api/submissions/` | GET, POST, PUT | Student submissions | Yes |
| `/api/discussions/` | GET, POST, PUT, DELETE | Discussion forums | Partial |
| `/api/discussion-comments/` | GET, POST, PUT, DELETE | Discussion comments | Partial |

---

## Authentication Flow

### 1. Register a User
```http
POST /api/users/register/
Content-Type: application/json

{
  "username": "student1",
  "email": "student1@example.com",
  "password": "securepassword123",
  "role": "student",
  "first_name": "John",
  "last_name": "Doe"
}
```

### 2. Login
```http
POST /api/users/login/
Content-Type: application/json

{
  "username": "student1",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 3. Use Access Token
Include the access token in the `Authorization` header:
```http
GET /api/courses/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### 4. Refresh Token (when access token expires)
```http
POST /api/users/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## Framework Examples

### React / Next.js

#### Setup API Client
```javascript
// src/api/client.js
const API_BASE_URL = 'http://localhost:8000/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.accessToken = localStorage.getItem('access_token');
  }

  setAccessToken(token) {
    this.accessToken = token;
    localStorage.setItem('access_token', token);
  }

  clearTokens() {
    this.accessToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry the original request
            headers['Authorization'] = `Bearer ${this.accessToken}`;
            const retryResponse = await fetch(url, { ...options, headers });
            return retryResponse.json();
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/users/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setAccessToken(data.access);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    this.clearTokens();
    return false;
  }

  // Authentication
  async login(username, password) {
    const data = await this.request('/users/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    this.setAccessToken(data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  }

  async register(userData) {
    return this.request('/users/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    this.clearTokens();
  }

  // Courses
  async getCourses() {
    return this.request('/courses/');
  }

  async getCourse(id) {
    return this.request(`/courses/${id}/`);
  }

  async createCourse(courseData) {
    return this.request('/courses/', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  // Enrollments
  async enrollInCourse(courseId) {
    return this.request('/enrollments/', {
      method: 'POST',
      body: JSON.stringify({ course: courseId }),
    });
  }

  async getMyEnrollments() {
    return this.request('/enrollments/');
  }

  // Assignments
  async getAssignments(courseId = null) {
    const url = courseId ? `/assignments/?course=${courseId}` : '/assignments/';
    return this.request(url);
  }

  async submitAssignment(assignmentId, file) {
    const formData = new FormData();
    formData.append('assignment', assignmentId);
    formData.append('file', file);

    return this.request('/submissions/', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for multipart/form-data
      body: formData,
    });
  }
}

export const apiClient = new ApiClient();
```

#### Usage in Components
```jsx
// src/components/CourseList.jsx
import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await apiClient.getCourses();
        setCourses(data.results || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="course-list">
      <h2>Available Courses</h2>
      {courses.map(course => (
        <div key={course.id} className="course-card">
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p>Instructor: {course.lecturer_name}</p>
        </div>
      ))}
    </div>
  );
}

export default CourseList;
```

#### Login Component
```jsx
// src/components/Login.jsx
import { useState } from 'react';
import { apiClient } from '../api/client';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await apiClient.login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
```

---

### Vue.js

#### Setup API Service
```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default {
  // Auth
  login(username, password) {
    return apiClient.post('/users/login/', { username, password })
      .then(response => {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        return response.data;
      });
  },

  register(userData) {
    return apiClient.post('/users/register/', userData);
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Courses
  getCourses() {
    return apiClient.get('/courses/');
  },

  getCourse(id) {
    return apiClient.get(`/courses/${id}/`);
  },

  createCourse(courseData) {
    return apiClient.post('/courses/', courseData);
  },

  // Enrollments
  enrollInCourse(courseId) {
    return apiClient.post('/enrollments/', { course: courseId });
  },

  getMyEnrollments() {
    return apiClient.get('/enrollments/');
  },

  // Assignments
  getAssignments(courseId = null) {
    const url = courseId ? `/assignments/?course=${courseId}` : '/assignments/';
    return apiClient.get(url);
  },

  submitAssignment(assignmentId, file) {
    const formData = new FormData();
    formData.append('assignment', assignmentId);
    formData.append('file', file);

    return apiClient.post('/submissions/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
```

#### Usage in Components
```vue
<!-- src/components/CourseList.vue -->
<template>
  <div class="course-list">
    <h2>Available Courses</h2>
    
    <div v-if="loading">Loading courses...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div v-for="course in courses" :key="course.id" class="course-card">
        <h3>{{ course.title }}</h3>
        <p>{{ course.description }}</p>
        <p>Instructor: {{ course.lecturer_name }}</p>
        <button @click="enrollInCourse(course.id)">Enroll</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'CourseList',
  data() {
    return {
      courses: [],
      loading: true,
      error: null,
    };
  },
  async mounted() {
    try {
      const response = await api.getCourses();
      this.courses = response.data.results || response.data;
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async enrollInCourse(courseId) {
      try {
        await api.enrollInCourse(courseId);
        alert('Successfully enrolled!');
      } catch (err) {
        alert('Enrollment failed: ' + err.message);
      }
    },
  },
};
</script>

<style scoped>
.course-list {
  padding: 20px;
}

.course-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
}

.error {
  color: red;
}
</style>
```

---

### Angular

#### Setup API Service
```typescript
// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';

interface AuthResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load user from localStorage if exists
    const token = localStorage.getItem('access_token');
    if (token) {
      // Optionally decode JWT to get user info
      this.currentUserSubject.next({ token });
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  // Auth methods
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/login/`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          this.currentUserSubject.next(response);
        }),
        catchError(this.handleError)
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register/`, userData)
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUserSubject.next(null);
  }

  // Course methods
  getCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getCourse(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${id}/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/`, courseData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Enrollment methods
  enrollInCourse(courseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/enrollments/`, 
      { course: courseId }, 
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getMyEnrollments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/enrollments/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

#### Usage in Component
```typescript
// src/app/components/course-list/course-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.apiService.getCourses().subscribe({
      next: (response) => {
        this.courses = response.results || response;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  enrollInCourse(courseId: number): void {
    this.apiService.enrollInCourse(courseId).subscribe({
      next: () => {
        alert('Successfully enrolled!');
      },
      error: (err) => {
        alert('Enrollment failed: ' + err.message);
      }
    });
  }
}
```

---

## Common Patterns

### Handling File Uploads

```javascript
// Example: Submit assignment with file
async function submitAssignment(assignmentId, file) {
  const formData = new FormData();
  formData.append('assignment', assignmentId);
  formData.append('file', file);
  formData.append('text_submission', 'Optional text content');

  const response = await fetch('http://localhost:8000/api/submissions/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      // Don't set Content-Type for FormData - browser will set it with boundary
    },
    body: formData,
  });

  return await response.json();
}
```

### Pagination

```javascript
// The API returns paginated results
async function getCourses(page = 1) {
  const response = await fetch(`http://localhost:8000/api/courses/?page=${page}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  });

  const data = await response.json();
  
  return {
    results: data.results,      // Array of courses
    count: data.count,          // Total number of items
    next: data.next,            // URL to next page (or null)
    previous: data.previous,    // URL to previous page (or null)
  };
}
```

### Error Handling

```javascript
async function handleApiCall() {
  try {
    const response = await fetch('http://localhost:8000/api/courses/');
    
    if (!response.ok) {
      // Handle HTTP errors
      if (response.status === 401) {
        // Unauthorized - redirect to login
        window.location.href = '/login';
        return;
      }
      
      if (response.status === 403) {
        // Forbidden - show error
        alert('You do not have permission to access this resource');
        return;
      }
      
      if (response.status === 404) {
        // Not found
        alert('Resource not found');
        return;
      }
      
      // Other errors
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.detail || 'An error occurred');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

---

## Testing the API

### Using cURL

```bash
# Get all courses
curl http://localhost:8000/api/courses/

# Login
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Get courses with authentication
curl http://localhost:8000/api/courses/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Browser Console

```javascript
// Quick test in browser console
fetch('http://localhost:8000/api/courses/')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Using API Documentation

Visit **http://localhost:8000/api/schema/swagger-ui/** for interactive API documentation where you can test all endpoints directly in your browser.

---

## Common Issues & Solutions

### CORS Errors
**Not an issue!** CORS is pre-configured to allow all origins in development mode.

### 401 Unauthorized
- Check if access token is valid
- Try refreshing the token
- Re-login if refresh token is expired

### 403 Forbidden
- User doesn't have permission for this action
- Check user role (student/lecturer/admin)

### 404 Not Found
- Verify the endpoint URL
- Check if the resource ID exists

### 500 Server Error
- Check backend logs: `docker-compose logs -f web`
- Verify database is running: `docker-compose ps`

---

## Next Steps

1. **Explore the API**: Visit http://localhost:8000/api/schema/swagger-ui/
2. **Create test users**: Use the Django admin panel at http://localhost:8000/admin/
3. **Build your UI**: Use the examples above as a starting point
4. **Handle edge cases**: Add proper error handling and loading states
5. **Add features**: Implement real-time updates, notifications, etc.

---

## Need Help?

- **API Documentation**: http://localhost:8000/api/schema/swagger-ui/
- **Backend Logs**: `docker-compose logs -f web`
- **Test API**: Run `./test-api.sh` to verify everything is working
- **Database Issues**: Run `docker-compose down -v && docker-compose up`

Happy coding! 🚀