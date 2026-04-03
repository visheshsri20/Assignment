import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check both localStorage (remember me) and sessionStorage
    const stored =
      localStorage.getItem('auth') || sessionStorage.getItem('auth')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Check token not expired
        if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
          setToken(parsed.token)
          setUser({ name: parsed.name, email: parsed.email, role: parsed.role })
        } else {
          localStorage.removeItem('auth')
          sessionStorage.removeItem('auth')
        }
      } catch {
        /* ignore corrupt storage */
      }
    }
    setLoading(false)
  }, [])

  const login = (data, rememberMe) => {
    const payload = JSON.stringify(data)
    if (rememberMe) {
      localStorage.setItem('auth', payload)
    } else {
      sessionStorage.setItem('auth', payload)
    }
    setToken(data.token)
    setUser({ name: data.name, email: data.email, role: data.role,ip: data.ipAddress })
  }

  const logout = () => {
    localStorage.removeItem('auth')
    sessionStorage.removeItem('auth')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
