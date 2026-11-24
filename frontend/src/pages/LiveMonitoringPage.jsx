import { useMemo, useState } from 'react'
import { Cctv, Radio, WifiOff, Play, Pause } from 'lucide-react'
import { Badge, Button, Card, PageHeader } from '../components/ui/Primitives'
import { useAppData } from '../context/AppDataContext'
import { cn, formatTime } from '../lib/utils'

const overlays = {
  'Pond 1': [{ label: 'Person', conf: 97, x: 18, y: 22, w: 24, h: 34, color: 'rose' }, { label: 'Zone', zone: true, points: '12,58 44,55 46,88 10,92' }],
  'Pond 2': [{ label: 'Dog', conf: 91, x: 48, y: 46, w: 20, h: 18, color: 'amber' }, { label: 'Zone', zone: true, points: '20,60 62,58 66,90 18,92' }],
  'Storage Area': [],
  'Main Entrance': [{ label: 'Person', conf: 88, x: 40, y: 28, w: 18, h: 30, color: 'rose' }],
}

const bgByCamera = {
  'Pond 1': 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=1200&q=80',
  'Pond 2': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'Storage Area': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
  'Main Entrance': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80',
}

function CameraFeed({ camera, running }) {
  const items = running ? (overlays[camera.name] || []) : []
  return (
    <Card className="overflow-hidden p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 font-semibold text-white"><Cctv className="h-4 w-4 text-aqua-300" /> {camera.name}</div>
          <div className="text-xs text-slate-400">{camera.location}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={camera.status === 'Online' ? 'success' : 'danger'}>{camera.status}</Badge>
          {running && camera.status === 'Online' && <Badge tone="info"><Radio className="mr-1 h-3 w-3" /> Detecting</Badge>}
        </div>
      </div>
      <div className={cn('relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-ocean-900', camera.status !== 'Online' && 'opacity-80')}>
        <img src={bgByCamera[camera.name]} alt={`${camera.name} preview`} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/70 via-transparent to-ocean-950/20" />
        {camera.status !== 'Online' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ocean-950/50 text-slate-200">
            <WifiOff className="h-8 w-8 text-rose-300" />
            <div className="font-medium">Camera offline</div>
            <div className="text-xs text-slate-400">No live stream available</div>
          </div>
        ) : (
          <>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {items.filter(i => i.zone).map((z, idx) => (
                <g key={idx}>
                  <polygon points={z.points} fill="rgba(45,212,191,0.12)" stroke="rgba(45,212,191,0.9)" strokeWidth="1.2" />
                </g>
              ))}
            </svg>
            {items.filter(i => !i.zone).map((d, idx) => (
              <div key={idx} className={cn('absolute rounded-md border-2', d.color === 'rose' ? 'border-rose-400' : 'border-amber-400')} style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.w}%`, height: `${d.h}%` }}>
                <div className={cn('absolute -top-6 left-0 rounded px-2 py-0.5 text-xs font-semibold text-white', d.color === 'rose' ? 'bg-rose-500' : 'bg-amber-500')}>{d.label} · {d.conf}%</div>
              </div>
            ))}
            <div className="absolute bottom-2 left-2 rounded-md bg-ocean-950/70 px-2 py-1 text-xs text-slate-200 ring-1 ring-white/10">Live video area · {running ? 'AI detection running (demo overlay)' : 'Monitoring preview'}</div>
            <div className="absolute bottom-2 right-2 rounded-md bg-ocean-950/70 px-2 py-1 text-xs text-slate-300 ring-1 ring-white/10">{new Date().toLocaleTimeString()}</div>
          </>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400 sm:grid-cols-4">
        <div className="rounded-lg bg-white/5 px-2 py-1.5">Stream: <span className="text-slate-200">{camera.status === 'Online' ? 'Connected' : 'Unavailable'}</span></div>
        <div className="rounded-lg bg-white/5 px-2 py-1.5">Zone: <span className="text-slate-200">{camera.zone}</span></div>
        <div className="rounded-lg bg-white/5 px-2 py-1.5">Detections: <span className="text-slate-200">{running && camera.status === 'Online' ? (items.filter(i=>!i.zone).length || 0) : '—'}</span></div>
        <div className="rounded-lg bg-white/5 px-2 py-1.5 truncate">RTSP: <span className="text-slate-200">{camera.rtspUrl}</span></div>
      </div>
    </Card>
  )
}

export default function LiveMonitoringPage() {
  const { cameras } = useAppData()
  const [running, setRunning] = useState(true)
  const active = useMemo(() => cameras.filter(c => c.status === 'Online').length, [cameras])

  return (
    <div>
      <PageHeader
        eyebrow="Live operations"
        title="Live CCTV monitoring"
        subtitle="View camera feeds, connection status, and AI detection bounding boxes. Live streams are shown as demo previews with simulated detection overlays unless RTSP/model services are connected."
        actions={
          <>
            <Badge tone={active ? 'success' : 'danger'}>{active}/{cameras.length} cameras online</Badge>
            <Button variant={running ? 'secondary' : 'primary'} onClick={() => setRunning(v => !v)}>
              {running ? <><Pause className="h-4 w-4" /> Pause detection overlay</> : <><Play className="h-4 w-4" /> Start detection overlay</>}
            </Button>
          </>
        }
      />
      <div className="mb-4 rounded-xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
        <strong>Mode:</strong> Demo monitoring view. Camera cards, statuses, and AI bounding boxes use sample data/simulated overlays for demonstration. Actual RTSP live inference requires a configured FastAPI + OpenCV/YOLO backend and reachable camera streams.
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {cameras.map(cam => <CameraFeed key={cam.id} camera={cam} running={running} />)}
      </div>
    </div>
  )
}