import { useMemo, useState } from 'react'
import { BellRing, Check, CheckCheck, Image as ImageIcon, Filter } from 'lucide-react'
import { Badge, Button, Card, PageHeader } from '../components/ui/Primitives'
import { useAppData } from '../context/AppDataContext'
import { formatDateTime } from '../lib/utils'

const snapshots = {
  'person-pond1': 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=900&q=80',
  'dog-pond2': 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
  'person-entrance': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80',
  'camera-offline': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
}

export default function AlertsPage() {
  const { alerts, acknowledgeAlert, resolveAlert } = useAppData()
  const [status, setStatus] = useState('All')
  const [type, setType] = useState('All')
  const [camera, setCamera] = useState('All')

  const types = ['All', ...Array.from(new Set(alerts.map(a => a.type)))]
  const cameras = ['All', ...Array.from(new Set(alerts.map(a => a.camera)))]

  const filtered = useMemo(() => alerts.filter(a =>
    (status === 'All' || a.status === status) &&
    (type === 'All' || a.type === type) &&
    (camera === 'All' || a.camera === camera)
  ), [alerts, status, type, camera])

  return (
    <div>
      <PageHeader
        eyebrow="Response center"
        title="Alerts and notifications"
        subtitle="Review, acknowledge, and resolve security alerts generated from detections, zone entries, and camera health events."
        actions={<Badge tone="info">{alerts.filter(a=>a.status==='Open').length} open alerts</Badge>}
      />

      <Card className="mb-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"><Filter className="h-4 w-4 text-aqua-300" /> Filter alerts</div>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="block"><span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Status</span>
            <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full rounded-xl border border-white/10 bg-ocean-900/70 px-3 py-2.5 text-sm text-white outline-none"><option>All</option><option>Open</option><option>Acknowledged</option><option>Resolved</option></select>
          </label>
          <label className="block"><span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Alert type</span>
            <select value={type} onChange={e=>setType(e.target.value)} className="w-full rounded-xl border border-white/10 bg-ocean-900/70 px-3 py-2.5 text-sm text-white outline-none">{types.map(t => <option key={t}>{t}</option>)}</select>
          </label>
          <label className="block"><span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Camera</span>
            <select value={camera} onChange={e=>setCamera(e.target.value)} className="w-full rounded-xl border border-white/10 bg-ocean-900/70 px-3 py-2.5 text-sm text-white outline-none">{cameras.map(c => <option key={c}>{c}</option>)}</select>
          </label>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map(alert => (
          <Card key={alert.id} className="overflow-hidden p-0">
            <div className="grid sm:grid-cols-[180px_1fr]">
              <div className="relative h-44 bg-ocean-900 sm:h-full">
                {snapshots[alert.snapshot] ? <img src={snapshots[alert.snapshot]} alt="Alert snapshot" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400"><ImageIcon /></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/60 to-transparent" />
                <div className="absolute bottom-2 left-2"><Badge tone="muted">Snapshot</Badge></div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 font-display text-lg font-bold text-white"><BellRing className="h-4 w-4 text-aqua-300" /> {alert.type}</div>
                    <div className="mt-1 text-sm text-slate-400">{alert.camera} · {formatDateTime(alert.dateTime)}</div>
                  </div>
                  <Badge tone={alert.status === 'Open' ? 'danger' : alert.status === 'Acknowledged' ? 'warning' : 'success'}>{alert.status}</Badge>
                </div>
                <p className="mt-3 text-sm text-slate-300">{alert.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">Confidence: {alert.confidence != null ? `${alert.confidence}%` : 'N/A'}</span>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">Source: {alert.source === 'model' ? 'Actual model' : 'Demo/simulated'}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => acknowledgeAlert(alert.id)} disabled={alert.status !== 'Open'}><Check className="h-4 w-4" /> Acknowledge</Button>
                  <Button size="sm" onClick={() => resolveAlert(alert.id)} disabled={alert.status === 'Resolved'}><CheckCheck className="h-4 w-4" /> Resolve</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && <Card className="mt-4 text-center text-slate-400">No alerts match the selected filters.</Card>}
    </div>
  )
}