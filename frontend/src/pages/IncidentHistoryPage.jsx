import { useMemo, useState } from 'react'
import { Search, Download, Eye, X } from 'lucide-react'
import { Badge, Button, Card, PageHeader } from '../components/ui/Primitives'
import { useAppData } from '../context/AppDataContext'
import { formatDateTime, downloadCsv } from '../lib/utils'

const snapshots = {
  'person-pond1': 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=1000&q=80',
  'dog-pond2': 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80',
  'person-entrance': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80',
  'camera-offline': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
}

export default function IncidentHistoryPage() {
  const { incidents } = useAppData()
  const [query, setQuery] = useState('')
  const [camera, setCamera] = useState('All')
  const [eventType, setEventType] = useState('All')
  const [date, setDate] = useState('')
  const [selected, setSelected] = useState(null)

  const cameras = ['All', ...Array.from(new Set(incidents.map(i => i.camera)))]
  const eventTypes = ['All', ...Array.from(new Set(incidents.map(i => i.eventType)))]

  const filtered = useMemo(() => incidents.filter(i => {
    const q = query.toLowerCase()
    const matchesQ = !q || [i.eventType, i.object, i.camera, i.zone, i.details].join(' ').toLowerCase().includes(q)
    return matchesQ && (camera === 'All' || i.camera === camera) && (eventType === 'All' || i.eventType === eventType) && (!date || (i.dateTime || '').slice(0,10) === date)
  }), [incidents, query, camera, eventType, date])

  const exportReport = () => {
    downloadCsv(`aquashield-incident-report-${new Date().toISOString().slice(0,10)}.csv`, filtered.map(i => ({
      id: i.id, dateTime: i.dateTime, eventType: i.eventType, object: i.object, camera: i.camera, zone: i.zone, confidence: i.confidence ?? '', source: i.source || 'demo', details: i.details
    })))
  }

  return (
    <div>
      <PageHeader
        eyebrow="Records & reporting"
        title="Incident history"
        subtitle="Search and filter previous detection events, inspect details and snapshots, and export incident reports."
        actions={<Button onClick={exportReport}><Download className="h-4 w-4" /> Export incident report</Button>}
      />

      <Card className="mb-4">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="block md:col-span-1">
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Search</span>
            <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search events, details..." className="w-full rounded-xl border border-white/10 bg-ocean-900/70 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:ring-2 focus:ring-aqua-400/30" /></div>
          </label>
          <label className="block"><span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Date</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full rounded-xl border border-white/10 bg-ocean-900/70 px-3 py-2.5 text-sm text-white outline-none" /></label>
          <label className="block"><span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Camera</span><select value={camera} onChange={e=>setCamera(e.target.value)} className="w-full rounded-xl border border-white/10 bg-ocean-900/70 px-3 py-2.5 text-sm text-white outline-none">{cameras.map(c=><option key={c}>{c}</option>)}</select></label>
          <label className="block"><span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Event type</span><select value={eventType} onChange={e=>setEventType(e.target.value)} className="w-full rounded-xl border border-white/10 bg-ocean-900/70 px-3 py-2.5 text-sm text-white outline-none">{eventTypes.map(t=><option key={t}>{t}</option>)}</select></label>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Date & time</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Object</th>
                <th className="px-4 py-3">Camera / Zone</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{formatDateTime(i.dateTime)}</td>
                  <td className="px-4 py-3 font-medium text-white">{i.eventType}</td>
                  <td className="px-4 py-3"><Badge tone={i.object === 'Person' ? 'info' : i.object === 'Dog' ? 'warning' : 'muted'}>{i.object}</Badge></td>
                  <td className="px-4 py-3 text-slate-300"><div>{i.camera}</div><div className="text-xs text-slate-500">{i.zone}</div></td>
                  <td className="px-4 py-3 text-slate-300">{i.confidence != null ? `${Math.round(i.confidence)}%` : '—'}</td>
                  <td className="px-4 py-3"><Badge tone={i.source === 'model' ? 'success' : 'muted'}>{i.source === 'model' ? 'Model' : 'Demo'}</Badge></td>
                  <td className="px-4 py-3"><Button size="sm" variant="secondary" onClick={() => setSelected(i)}><Eye className="h-4 w-4" /> View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-8 text-center text-slate-400">No incidents found for the selected filters.</div>}
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border border-white/10 bg-ocean-900 p-0 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div><div className="font-display text-xl font-bold text-white">{selected.eventType}</div><div className="text-sm text-slate-400">{formatDateTime(selected.dateTime)}</div></div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-[1.1fr_0.9fr]">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-ocean-950">
                <img src={snapshots[selected.snapshot] || snapshots['person-pond1']} alt="Incident snapshot" className="h-full w-full object-cover" />
              </div>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-white/5 p-3"><div className="text-xs text-slate-400">Object</div><div className="font-medium text-white">{selected.object}</div></div>
                  <div className="rounded-xl bg-white/5 p-3"><div className="text-xs text-slate-400">Confidence</div><div className="font-medium text-white">{selected.confidence != null ? `${Math.round(selected.confidence)}%` : 'N/A'}</div></div>
                  <div className="rounded-xl bg-white/5 p-3"><div className="text-xs text-slate-400">Camera</div><div className="font-medium text-white">{selected.camera}</div></div>
                  <div className="rounded-xl bg-white/5 p-3"><div className="text-xs text-slate-400">Zone</div><div className="font-medium text-white">{selected.zone}</div></div>
                </div>
                <div className="rounded-xl bg-white/5 p-3"><div className="text-xs text-slate-400">Source</div><div className="font-medium text-white">{selected.source === 'model' ? 'Actual model output' : 'Demo/simulated data'}</div></div>
                <div className="rounded-xl bg-white/5 p-3"><div className="mb-1 text-xs text-slate-400">Details</div><p className="leading-relaxed text-slate-200">{selected.details}</p></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}