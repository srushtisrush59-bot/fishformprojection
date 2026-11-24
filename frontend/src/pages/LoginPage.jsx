import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Lock, Mail, ShieldCheck } from 'lucide-react'
import Logo from '../components/ui/Logo'
import { Button, Card } from '../components/ui/Primitives'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('operator@aquashield.ai')
  const [password, setPassword] = useState('demo1234')
  const [error, setError] = useState('')

  if (isAuthenticated) return <Navigate to="/app/dashboard" replace />

  const onSubmit = (e) => {
    e.preventDefault()
    const res = login(email, password)
    if (!res.ok) { setError(res.error); return }
    navigate('/app/dashboard')
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=1600&q=80" alt="Fish farm ponds" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-950/80 via-ocean-950/90 to-ocean-950" />
      </div>
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="hidden lg:block">
            <Link to="/" className="inline-block"><Logo /></Link>
            <h1 className="mt-8 font-display text-5xl font-extrabold leading-tight text-white">Secure every pond with <span className="text-aqua-300">AI-powered visibility.</span></h1>
            <p className="mt-4 max-w-xl text-lg text-slate-300">Sign in to monitor cameras, review detections, manage protected zones, and respond to security alerts across your fish farm.</p>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
              {['Live CCTV monitoring', 'YOLO/OpenCV detection workflow', 'Protected zone alerts', 'Incident history & reports'].map(item => (
                <div key={item} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"><ShieldCheck className="h-4 w-4 text-aqua-300" /> {item}</div>
              ))}
            </div>
          </div>
          <Card className="mx-auto w-full max-w-md p-7 sm:p-8">
            <div className="mb-6 lg:hidden"><Link to="/"><Logo /></Link></div>
            <h2 className="font-display text-2xl font-bold text-white">Sign in</h2>
            <p className="mt-1 text-sm text-slate-400">Demo authentication for the AquaShield AI platform. Any valid email and password will sign you in.</p>
            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-300">Email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full rounded-xl border border-white/10 bg-ocean-900/70 py-2.5 pl-10 pr-3 text-white outline-none ring-aqua-400/30 placeholder:text-slate-500 focus:ring-2" placeholder="you@farm.com" />
                </div>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-300">Password</span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full rounded-xl border border-white/10 bg-ocean-900/70 py-2.5 pl-10 pr-3 text-white outline-none ring-aqua-400/30 placeholder:text-slate-500 focus:ring-2" placeholder="••••••••" />
                </div>
              </label>
              {error && <div className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div>}
              <Button type="submit" className="w-full" size="lg">Sign in to Dashboard</Button>
            </form>
            <p className="mt-5 text-center text-xs text-slate-500">Simulated login for demo purposes. No real credentials are transmitted.</p>
            <div className="mt-4 text-center"><Link to="/" className="text-sm text-aqua-300 hover:text-aqua-200">← Back to landing page</Link></div>
          </Card>
        </div>
      </div>
    </div>
  )
}