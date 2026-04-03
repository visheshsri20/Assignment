import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const stored =
    localStorage.getItem('auth') || sessionStorage.getItem('auth')
  if (stored) {
    try {
      const { token } = JSON.parse(stored)
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch { /* ignore */ }
  }
  return config
})

// Auth endpoints
export const register = (data) => api.post('/auth/register', data)
export const login    = (data) => api.post('/auth/login', data)
export const profile  = ()     => api.get('/user/profile')

export default api
