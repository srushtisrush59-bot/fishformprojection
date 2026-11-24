import { useState } from 'react'
import { Plus, Trash2, Wifi, Settings2, Camera, MapPin } from 'lucide-react'
import { Badge, Button, Card, PageHeader } from '../components/ui/Primitives'
import { useAppData } from '../context/AppDataContext'

export default function CameraManagementPage() {
  const { cameras, addCamera, removeCamera, updateCamera, testCameraConnection } = useAppData()
  const [form, setForm] = useState({ name: '', location: '', rtspUrl: '', zone: '' })
  const [testingId, setTestingId] = useState(null)
  const [message, setMessage] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.location.trim() || !form.rtspUrl.trim()) {
      setMessage('Camera name, location, and RTSP stream URL are required.')
      return
    }
    addCamera({ ...form, status: 'Offline' })
    setForm({ name: '', location: '', rtspUrl: '', zone: '' })
    setMessage('Camera added successfully (demo configuration saved in current session).')
  }

  const onTest = async (id) => {
    setTestingId(id)
    const ok = await testCameraConnection(id)
    setTestingId(null)
    setMessage(ok ? 'Connection test successful: camera is online (simulated check).' : 'Connection test failed: camera is offline/unreachable (simulated check).')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Device configuration"
        title="Camera management"
        subtitle="Add, configure, test, and remove CCTV cameras. RTSP URLs and connection tests are managed here; actual stream connectivity requires reachable cameras and backend services."
      />

      {message && <div className="mb-4 rounded-xl border border-aqua-400/20 bg-aqua-500/10 px-4 py-3 text-sm text-aqua-100">{message}</div>}

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <h3 className="font-display text-lg font-bold text-white">Add camera</h3>
          <p className="mt-1 text-sm text-slate-400">Configure a new camera with name, location, RTSP stream URL, and monitoring zone.</p>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <label className="block"><span className="mb-1 block text-sm text-slate-300">Camera name</span><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Pond 3" className="w-full rounded-xl border border-white/10 bg-ocean-900/70 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-aqua-400/30" /></label>
            <label className="block"><span className="mb-1 block text-sm text-slate-300">Location</span><input value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} placeholder="e.g. South Pond Boundary" className="w-full rounded-xl border border-white/10 bg-ocean-900/70 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-aqua-400/30" /></label>
            <label className="block"><span className="mb-1 block text-sm text-slate-300">RTSP stream URL</span><input value={form.rtspUrl} onChange={e=>setForm(f=>({...f,rtspUrl:e.target.value}))} placeholder="rtsp://user:pass@camera-ip/stream" className="w-full rounded-xl border border-white/10 bg-ocean-900/70 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-aqua-400/30" /></label>
            <label className="block"><span className="mb-1 block text-sm text-slate-300">Protected zone label (optional)</span><input value={form.zone} onChange={e=>setForm(f=>({...f,zone:e.target.value}))} placeholder="e.g. Pond 3 Protected Zone" className="w-full rounded-xl border border-white/10 bg-ocean-900/70 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-aqua-400/30" /></label>
            <Button type="submit" size="lg"><Plus className="h-4 w-4" /> Add camera</Button>
          </form>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-400">Connection status and test results shown here are simulated in demo mode unless integrated with the backend/camera network. RTSP configuration is stored for platform setup.</div>
        </Card>

        <div className="space-y-4">
          {cameras.map(cam => (
            <Card key={cam.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 font-display text-lg font-bold text-white"><Camera className="h-4 w-4 text-aqua-300" /> {cam.name}</div>
                    <Badge tone={cam.status === 'Online' ? 'success' : cam.status === 'Testing' ? 'warning' : 'danger'}>{cam.status}</Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-400"><MapPin className="h-4 w-4" /> {cam.location}</div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-300">
                    <div><span className="text-slate-400">RTSP URL:</span> <span className="break-all">{cam.rtspUrl}</span></div>
                    <div><span className="text-slate-400">Zone:</span> {cam.zone || 'Not assigned'}</div>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <label className="block"><span className="mb-1 block text-xs text-slate-400">Edit location</span><input value={cam.location} onChange={e=>updateCamera(cam.id,{location:e.target.value})} className="w-full rounded-lg border border-white/10 bg-ocean-900/70 px-2.5 py-2 text-sm text-white" /></label>
                    <label className="block"><span className="mb-1 block text-xs text-slate-400">Edit RTSP URL</span><input value={cam.rtspUrl} onChange={e=>updateCamera(cam.id,{rtspUrl:e.target.value})} className="w-full rounded-lg border border-white/10 bg-ocean-900/70 px-2.5 py-2 text-sm text-white" /></label>
                  </div>
                </div>
                <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
                  <Button variant="secondary" onClick={() => onTest(cam.id)} disabled={testingId === cam.id}><Wifi className="h-4 w-4" /> {testingId === cam.id ? 'Testing...' : 'Test connection'}</Button>
                  <Button variant="secondary" onClick={() => updateCamera(cam.id, { status: cam.status === 'Online' ? 'Offline' : 'Online' })}><Settings2 className="h-4 w-4" /> Toggle status</Button>
                  <Button variant="danger" onClick={() => removeCamera(cam.id)}><Trash2 className="h-4 w-4" /> Remove</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}