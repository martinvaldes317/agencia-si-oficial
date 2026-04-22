import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { API } from '../../context/AuthContext'
import { Eye, EyeOff, Loader } from 'lucide-react'

export default function ResetAdminPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres')
    if (password !== confirm) return setError('Las contraseñas no coinciden')

    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/admin/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      })
      const d = await res.json()
      if (d.success) {
        setSuccess(true)
      } else {
        setError(d.message || 'El enlace no es válido o ya expiró')
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    }
    setLoading(false)
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-zinc-500 text-sm">Enlace inválido.</p>
          <button onClick={() => navigate('/admin/clientes')} className="text-zinc-400 hover:text-white text-xs mt-3 transition-colors">← Volver al panel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <img src="/logo-dark.png" alt="AgenciaSi" className="h-10 w-auto" />
          </div>
          <p className="text-zinc-500 text-sm mt-3">Nueva contraseña de administrador</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          {success ? (
            <div className="text-center space-y-4">
              <p className="text-green-400 text-lg font-semibold">✓ Contraseña actualizada</p>
              <p className="text-zinc-500 text-sm">Ya puedes iniciar sesión con tu nueva contraseña.</p>
              <button
                onClick={() => navigate('/admin/clientes')}
                className="w-full bg-white text-black py-2.5 rounded-lg font-semibold text-sm hover:bg-zinc-100 transition-colors"
              >
                Ir al panel
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 bg-red-950 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1.5">Nueva contraseña</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 pr-10"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1.5">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  placeholder="Repite la contraseña"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-2.5 rounded-lg font-semibold text-sm hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader size={16} className="animate-spin" /> : 'Guardar nueva contraseña'}
              </button>
            </form>
          )}
        </div>

        <button onClick={() => navigate('/admin/clientes')} className="block text-center text-zinc-600 hover:text-zinc-400 text-xs mt-4 transition-colors">← Volver al login</button>
      </div>
    </div>
  )
}
