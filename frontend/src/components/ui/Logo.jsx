import { Fish, Shield } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function Logo({ compact = false, className = '' }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-aqua-400/30 via-sky-400/20 to-teal-500/30 ring-1 ring-white/15 shadow-lg shadow-cyan-950/30">
        <Fish className="h-5 w-5 text-aqua-300" />
        <div className="absolute -right-1 -bottom-1 rounded-full bg-ocean-900 p-1 ring-1 ring-white/15">
          <Shield className="h-3.5 w-3.5 text-sky-400" />
        </div>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-display text-lg font-extrabold tracking-tight text-white">AquaShield <span className="text-aqua-300">AI</span></div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Smart Monitoring</div>
        </div>
      )}
    </div>
  )
}