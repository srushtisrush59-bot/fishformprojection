import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboard, Cctv, ScanEye, ShieldAlert, BellRing, History, Camera, Map, Menu, X, LogOut, LogIn, Sparkles } from 'lucide-react'
import Logo from '../ui/Logo'
import { cn } from '../../lib/utils'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/live-monitoring', label: 'Live CCTV', icon: Cctv },
  { to: '/app/ai-detection', label: 'AI Detection', icon: ScanEye },
  { to: '/app/zones', label: 'Protected Zones', icon: Map },
  { to: '/app/alerts', label: 'Alerts', icon: BellRing },
  { to: '/app/incidents', label: 'Incident History', icon: History },
  { to: '/app/cameras', label: 'Camera Management', icon: Camera },
]

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const title = navItems.find(n => location.pathname.startsWith(n.to))?.label || 'AquaShield AI'

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10 grid-overlay opacity-20" />
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className={cn('fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-ocean-950/80 backdrop-blur-xl transition-transform lg:static lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
          <div className="flex h-full flex-col p-4">
            <div className="mb-6 flex items-center justify-between px-2 pt-2">
              <button onClick={() => navigate('/')} className="text-left"><Logo /></button>
              <button className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map(item => (
                <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition', isActive ? 'bg-aqua-500/15 text-aqua-200 ring-1 ring-inset ring-aqua-400/20' : 'text-slate-300 hover:bg-white/6 hover:text-white')}>
                  <item.icon className="h-4.5 w-4.5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white"><ShieldAlert className="h-4 w-4 text-aqua-300" /> Demo environment</div>
              <p className="text-xs leading-relaxed text-slate-400">Sample farm data and simulated camera states are shown unless a live backend/model connection is configured.</p>
            </div>
          </div>
        </aside>

        {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-ocean-950/60 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400"><Sparkles className="h-3.5 w-3.5 text-aqua-300" /> AquaShield AI Platform</div>
                  <div className="font-display text-lg font-bold text-white">{title}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    <div className="hidden text-right sm:block">
                      <div className="text-sm font-medium text-white">{user?.name}</div>
                      <div className="text-xs text-slate-400">{user?.role} {user?.simulated && '· demo login'}</div>
                    </div>
                    <button onClick={() => { logout(); navigate('/') }} className="inline-flex items-center gap-2 rounded-xl bg-white/8 px-3 py-2 text-sm font-medium text-slate-100 ring-1 ring-inset ring-white/10 hover:bg-white/12"><LogOut className="h-4 w-4" /> Logout</button>
                  </>
                ) : (
                  <NavLink to="/login" className="inline-flex items-center gap-2 rounded-xl bg-aqua-500 px-3 py-2 text-sm font-semibold text-ocean-950 hover:bg-aqua-400"><LogIn className="h-4 w-4" /> Login</NavLink>
                )}
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}