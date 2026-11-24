const API_BASE = import.meta.env.VITE_API_BASE || '/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status}`)
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

export const api = {
  health: () => request('/health'),
  listCameras: () => request('/cameras'),
  listAlerts: () => request('/alerts'),
  listIncidents: () => request('/incidents'),
  listZones: () => request('/zones'),
  detectUpload: async (file) => {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${API_BASE}/detect/upload`, { method: 'POST', body: form })
    if (!res.ok) throw new Error(await res.text().catch(() => `Upload failed: ${res.status}`))
    return res.json()
  },
}

export async function tryApi(fn, fallback) {
  try {
    const data = await fn()
    return { data, connected: true }
  } catch {
    return { data: fallback, connected: false }
  }
}