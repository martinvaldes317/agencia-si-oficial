import { useEffect, useState } from 'react'
import { useAuth, API } from '../../context/AuthContext'
import { FolderOpen, Download, FileText, FileImage, File, Filter } from 'lucide-react'

const categoryLabels = {
  general: 'General',
  reporte: 'Reporte',
  contrato: 'Contrato',
  creativo: 'Creativo',
}

const categoryColors = {
  general: 'bg-zinc-700 text-zinc-300',
  reporte: 'bg-blue-900 text-blue-300',
  contrato: 'bg-purple-900 text-purple-300',
  creativo: 'bg-pink-900 text-pink-300',
}

function FileIcon({ mimeType, size = 24 }) {
  if (mimeType?.startsWith('image/')) return <FileImage size={size} className="text-pink-400" />
  if (mimeType?.includes('pdf')) return <FileText size={size} className="text-red-400" />
  return <File size={size} className="text-zinc-400" />
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function PortalFiles() {
  const { authFetch, client } = useAuth()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [downloading, setDownloading] = useState(null)

  useEffect(() => {
    authFetch('/api/portal/files')
      .then(r => r.json())
      .then(d => { setFiles(d.files || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? files : files.filter(f => f.category === filter)
  const categories = [...new Set(files.map(f => f.category))]

  const handleDownload = async (file) => {
    setDownloading(file.id)
    try {
      const token = client?.token || localStorage.getItem('clientToken')
      const res = await fetch(`${API}/api/portal/files/${file.id}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.originalName
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Error al descargar el archivo.')
    } finally {
      setDownloading(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Archivos</h1>
        <p className="text-zinc-500 text-sm mt-1">Documentos y recursos compartidos por tu agencia</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {['all', ...categories].map(cat => {
          const count = cat === 'all' ? files.length : files.filter(f => f.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`bg-zinc-900 border rounded-xl p-4 text-left transition-all
                ${filter === cat ? 'border-white' : 'border-zinc-800 hover:border-zinc-600'}`}
            >
              <p className="text-white text-xl font-bold">{count}</p>
              <p className="text-zinc-500 text-xs mt-1">{cat === 'all' ? 'Todos' : categoryLabels[cat] || cat}</p>
            </button>
          )
        })}
      </div>

      {/* Files grid */}
      {filtered.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <FolderOpen size={40} className="text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">No hay archivos en esta categoría.</p>
          <p className="text-zinc-600 text-sm mt-1">Tu agencia irá subiendo documentos aquí.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(file => (
            <div key={file.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                  <FileIcon mimeType={file.mimeType} size={24} />
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[file.category] || 'bg-zinc-700 text-zinc-300'}`}>
                  {categoryLabels[file.category] || file.category}
                </span>
              </div>
              <p className="text-white text-sm font-medium truncate mb-1">{file.originalName}</p>
              <p className="text-zinc-600 text-xs mb-4">
                {formatSize(file.size)} · {new Date(file.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <button
                onClick={() => handleDownload(file)}
                disabled={downloading === file.id}
                className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-white hover:text-black text-zinc-300 text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {downloading === file.id ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                Descargar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
