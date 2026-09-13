import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function AuthProvider({ children }) {
  const [client, setClient] = useState(null)
  const [adminToken, setAdminToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('clientToken')
    const stored = localStorage.getItem('clientData')
    // Un valor corrupto acá (ej. la string literal "undefined") no debe
    // tumbar toda la app — sin este try/catch, un JSON.parse fallido queda
    // sin capturar y React desmonta todo el árbol (pantalla en blanco en
    // cualquier ruta, no solo el login).
    if (token && stored) {
      try {
        setClient({ ...JSON.parse(stored), token })
      } catch {
        localStorage.removeItem('clientToken')
        localStorage.removeItem('clientData')
      }
    }
    const at = localStorage.getItem('adminToken')
    if (at) setAdminToken(at)
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    if (data.role === 'admin') {
      localStorage.setItem('adminToken', data.token)
      setAdminToken(data.token)
      return 'admin'
    }
    localStorage.setItem('clientToken', data.token)
    localStorage.setItem('clientData', JSON.stringify(data.client || {}))
    setClient({ ...(data.client || {}), token: data.token })
    return 'client'
  }

  const loginAdmin = async (password) => {
    const res = await fetch(`${API}/api/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    localStorage.setItem('adminToken', data.token)
    setAdminToken(data.token)
    return data.token
  }

  const logoutClient = () => {
    localStorage.removeItem('clientToken')
    localStorage.removeItem('clientData')
    setClient(null)
  }

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken')
    setAdminToken(null)
  }

  const authFetch = async (url, options = {}) => {
    const token = client?.token || adminToken
    return fetch(`${API}${url}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers }
    })
  }

  return (
    <AuthContext.Provider value={{ client, adminToken, loading, login, loginAdmin, logoutClient, logoutAdmin, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
