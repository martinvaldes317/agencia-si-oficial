import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AdminLayout from './admin/AdminLayout'
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'

export default function AdminSettings() {
  const { adminToken, loginAdmin, authFetch } = useAuth()
  const [pwd, setPwd] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoggingIn(true); setLoginError('')
    try { await loginAdmin(pwd) }
    catch (err) { setLoginError(err.message || 'Contraseña incorrecta') }
    finally { setLoggingIn(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError(''); setSuccess(false)
    if (newPwd.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.')
    if (newPwd !== confirmPwd) return setError('Las contraseñas no coinciden.')
    setSaving(true)
    try {
      const res = await authFetch('/api/auth/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({ newPassword: newPwd }),
      })
      const d = await res.json()
      if (!d.success) throw new Error(d.message || 'No se pudo cambiar la contraseña')
      setSuccess(true)
      setNewPwd(''); setConfirmPwd('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-white flex items-center justify-center rounded-sm">
              <span className="text-black font-bold text-sm italic">SI</span>
            </div>
            <span className="text-white font-bold tracking-tighter text-sm uppercase">Admin Panel</span>
          </div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Contraseña de administrador</label>
          <div className="relative mb-4">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="password" value={pwd} onChange={e => setPwd(e.target.value)} required autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20"
            />
          </div>
          {loginError && <p className="text-red-400 text-xs mb-4">{loginError}</p>}
          <button type="submit" disabled={loggingIn}
            className="w-full bg-white text-black py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 transition-all">
            {loggingIn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Ingresar'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <AdminLayout active="configuracion">
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-white font-bold uppercase tracking-widest text-sm mb-8">Configuración</h1>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md">
          <h2 className="text-white font-bold text-sm mb-1">Cambiar contraseña de administrador</h2>
          <p className="text-zinc-500 text-xs mb-6">Esta es la contraseña compartida para entrar a este panel.</p>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Nueva contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPwd ? 'text' : 'password'} value={newPwd} onChange={e => setNewPwd(e.target.value)}
                  required minLength={6} placeholder="Mínimo 6 caracteres" autoComplete="new-password"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-white/20"
                />
                <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Confirmar contraseña</label>
              <input
                type={showPwd ? 'text' : 'password'} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
                required placeholder="Repite la contraseña" autoComplete="new-password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20"
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}
            {success && (
              <p className="text-emerald-400 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Contraseña actualizada correctamente.
              </p>
            )}

            <button type="submit" disabled={saving}
              className="w-full bg-white text-black py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 transition-all">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Guardar nueva contraseña'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
