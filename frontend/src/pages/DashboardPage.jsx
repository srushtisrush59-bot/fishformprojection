import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts'
import { Camera, Users, Dog, BellRing, Activity, CheckCircle2 } from 'lucide-react'
import { Card, PageHeader, StatCard, Badge } from '../components/ui/Primitives'
import { useAppData } from '../context/AppDataContext'
import { weeklyAnalytics, monthlyAnalytics } from '../data/sampleData'
import { formatDateTime } from '../lib/utils'

const pieColors = ['#2dd4bf', '#38bdf8', '#fbbf24', '#fb7185']

export default function DashboardPage() {
  const { stats, cameras, alerts, incidents } = useAppData()
  const recent = incidents.slice(0, 5)
  const statusCounts = [
    { name: 'Online', value: cameras.filter(c => c.status === 'Online').length },
    { name: 'Offline', value: cameras.filter(c => c.status === 'Offline').length },
    { name: 'Testing', value: cameras.filter(c => c.status === 'Testing').length },
  ].filter(x => x.value > 0)

  return (
    <div>
      <PageHeader
        eyebrow="Operations overview"
        title="Fish farm security dashboard"
        subtitle="Real-time overview of connected cameras, detections, and alerts. Metrics shown use realistic sample farm data unless a live backend connection is configured."
        actions={<Badge tone="info">Data source: Demo sample data</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total connected cameras" value={stats.totalCameras} icon={Camera} tone="aqua" subtext={`${stats.activeCameras} currently online`} />
        <StatCard label="Active cameras" value={stats.activeCameras} icon={CheckCircle2} tone="emerald" subtext="Streaming/healthy" />
        <StatCard label="Total detected people" value={stats.totalPeople} icon={Users} tone="sky" subtext="Historical person detections" />
        <StatCard label="Animal intrusion count" value={stats.animalIntrusions} icon={Dog} tone="amber" subtext="Dog/animal-related incidents" />
        <StatCard label="Today's security alerts" value={stats.todaysAlerts} icon={BellRing} tone="rose" subtext={`${stats.openAlerts} open alerts`} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-white">Weekly detection analytics</h3>
              <p className="text-sm text-slate-400">People, animals, and generated alerts over the last 7 days (sample).</p>
            </div>
            <Badge tone="muted">Weekly</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyAnalytics} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gPeople" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5}/><stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/></linearGradient>
                  <linearGradient id="gAnimals" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fbbf24" stopOpacity={0.45}/><stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0b2430', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, color: '#e2e8f0' }} />
                <Area type="monotone" dataKey="people" stroke="#38bdf8" fill="url(#gPeople)" strokeWidth={2} name="People" />
                <Area type="monotone" dataKey="animals" stroke="#fbbf24" fill="url(#gAnimals)" strokeWidth={2} name="Animals" />
                <Area type="monotone" dataKey="alerts" stroke="#fb7185" fill="transparent" strokeWidth={2} name="Alerts" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h3 className="font-display text-lg font-bold text-white">Camera connection status</h3>
            <p className="text-sm text-slate-400">Current connectivity across configured cameras.</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusCounts} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={4}>
                  {statusCounts.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0b2430', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, color: '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {cameras.map(c => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
                <div><div className="font-medium text-white">{c.name}</div><div className="text-xs text-slate-400">{c.location}</div></div>
                <Badge tone={c.status === 'Online' ? 'success' : c.status === 'Testing' ? 'warning' : 'danger'}>{c.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-white">Monthly detection trend</h3>
              <p className="text-sm text-slate-400">Total detections by week this month (sample).</p>
            </div>
            <Badge tone="muted">Monthly</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyAnalytics}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0b2430', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, color: '#e2e8f0' }} />
                <Bar dataKey="detections" fill="#2dd4bf" radius={[8,8,0,0]} name="Detections" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="font-display text-lg font-bold text-white">Recent incidents</h3><p className="text-sm text-slate-400">Latest detection and security events.</p></div>
            <Activity className="h-5 w-5 text-aqua-300" />
          </div>
          <div className="space-y-3">
            {recent.map(inc => (
              <div key={inc.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><span className="font-medium text-white">{inc.eventType}</span><Badge tone={inc.object === 'Person' ? 'info' : inc.object === 'Dog' ? 'warning' : 'muted'}>{inc.object}</Badge></div>
                  <div className="mt-1 text-sm text-slate-400">{inc.camera} · {inc.zone}</div>
                  <div className="mt-1 text-xs text-slate-500">{formatDateTime(inc.dateTime)} {inc.confidence ? `· ${Math.round(inc.confidence)}% confidence` : ''}</div>
                </div>
                <Badge tone={/intrusion/i.test(inc.eventType) ? 'danger' : 'default'}>{/intrusion/i.test(inc.eventType) ? 'Alerted' : 'Logged'}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}