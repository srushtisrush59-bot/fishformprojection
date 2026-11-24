import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Camera, ScanEye, BellRing, ShieldCheck, Waves, Radar, Cctv } from 'lucide-react'
import Logo from '../components/ui/Logo'
import { Badge, Button, Card } from '../components/ui/Primitives'

const features = [
  { icon: ScanEye, title: 'AI Detection', desc: 'YOLO-powered object detection identifies people and animals such as dogs with confidence scores and timestamps.' },
  { icon: Cctv, title: 'CCTV Monitoring', desc: 'Monitor multiple pond cameras, check live status, and visualize detection overlays across your farm.' },
  { icon: BellRing, title: 'Instant Alerts', desc: 'Receive security alerts when intrusions or protected-zone events occur, with snapshots and response actions.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ocean-950/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/"><Logo /></Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#platform" className="hover:text-white">Platform</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/app/dashboard" className="hidden sm:inline-flex"><Button variant="secondary">Explore Dashboard</Button></Link>
            <Link to="/login"><Button>Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=80" alt="Aquaculture ponds" className="h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-950 via-ocean-950/90 to-ocean-900/60" />
          </div>
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge tone="info" className="mb-4">AI-powered fish farm security platform</Badge>
              <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">Protect Your Fish Farm with <span className="text-aqua-300">AI-Powered Security</span></h1>
              <p className="mt-5 max-w-2xl text-lg text-slate-300">AquaShield AI combines CCTV monitoring, YOLO object detection, protected zone management, and instant alerts to help farmers detect people and animals before they become costly security incidents.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login"><Button size="lg">Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
                <Link to="/app/dashboard"><Button size="lg" variant="secondary">Explore Dashboard</Button></Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-aqua-300" /> Protected pond zones</div>
                <div className="flex items-center gap-2"><Radar className="h-4 w-4 text-aqua-300" /> Real-time detection workflow</div>
                <div className="flex items-center gap-2"><Waves className="h-4 w-4 text-aqua-300" /> Built for aquaculture sites</div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="relative">
              <Card className="overflow-hidden p-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-ocean-900">
                  <img src="https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=1200&q=80" alt="Fish farm monitoring" className="h-full w-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/80 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 flex gap-2"><Badge tone="success">Pond 1 · Online</Badge><Badge tone="danger">Person 97%</Badge></div>
                  <div className="absolute left-[18%] top-[22%] h-[38%] w-[28%] rounded-md border-2 border-rose-400/90 shadow-[0_0_0_9999px_rgba(2,8,12,0.08)]">
                    <div className="absolute -top-6 left-0 rounded bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">Person · 97%</div>
                  </div>
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon points="12,55 48,52 52,88 10,92" fill="rgba(45,212,191,0.12)" stroke="rgba(45,212,191,0.9)" strokeWidth="1.5" />
                    <text x="13" y="53" fill="#5eead4" fontSize="3.2">Pond 1 Protected Zone</text>
                  </svg>
                  <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2">
                    {[['Cameras', '4 connected'], ['Today alerts', '4 events'], ['AI model', 'YOLO ready']].map(([k,v]) => (
                      <div key={k} className="rounded-lg border border-white/10 bg-ocean-950/70 px-3 py-2 backdrop-blur"><div className="text-[11px] uppercase tracking-wide text-slate-400">{k}</div><div className="text-sm font-semibold text-white">{v}</div></div>
                    ))}
                  </div>
                </div>
              </Card>
              <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-aqua-400/20 blur-3xl" />
            </motion.div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <Badge tone="info">Core capabilities</Badge>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">Everything needed to monitor and secure fish farms</h2>
            <p className="mt-3 text-slate-400">Designed as a practical security operations platform for aquaculture environments, with clear workflows from detection to response.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-aqua-500/15 ring-1 ring-inset ring-aqua-400/20"><f.icon className="h-6 w-6 text-aqua-300" /></div>
                  <h3 className="font-display text-xl font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="how" className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <Badge tone="info">Demonstration workflow</Badge>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-white">From video to actionable incident</h2>
              <p className="mt-3 text-slate-400">AquaShield AI is built around a complete security workflow so operators can move quickly from detection to response.</p>
              <ol className="mt-6 space-y-3">
                {['Upload or select a CCTV video.', 'Run AI object detection (YOLO/OpenCV).', 'Detect a person or dog near pond areas.', 'Check protected pond zone entry.', 'Generate a security alert and snapshot.', 'Save and review incident history in dashboard.'].map((step, i) => (
                  <li key={step} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-aqua-500/20 text-sm font-bold text-aqua-200">{i+1}</span><span className="text-sm text-slate-200">{step}</span></li>
                ))}
              </ol>
            </div>
            <div id="platform" className="grid gap-4 sm:grid-cols-2">
              {[{t:'Dashboard intelligence',d:'Track cameras, alerts, people, animal intrusions, and trends in one place.',i:Camera},{t:'Zone-aware security',d:'Mark protected pond areas and trigger events on unauthorized entry.',i:ShieldCheck},{t:'Incident accountability',d:'Search, filter, inspect, and export detection history for farm records.',i:Radar},{t:'Operational readiness',d:'Manage cameras, RTSP streams, and connection health with clear status.',i:Cctv}].map(item => (
                <Card key={item.t}><item.i className="h-5 w-5 text-aqua-300" /><h3 className="mt-3 font-semibold text-white">{item.t}</h3><p className="mt-1.5 text-sm text-slate-400">{item.d}</p></Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <Logo />
            <p className="mt-3 max-w-md text-sm text-slate-400">AquaShield AI — Smart Monitoring. Safer Fish Farms. AI-powered intrusion detection and alerting for modern aquaculture operations.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-300">
            <Link to="/login" className="hover:text-white">Login</Link>
            <Link to="/app/dashboard" className="hover:text-white">Dashboard</Link>
            <a href="#features" className="hover:text-white">Features</a>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">© 2026 AquaShield AI. Demo platform UI — simulated data labeled where live connections are unavailable.</div>
      </footer>
    </div>
  )
}