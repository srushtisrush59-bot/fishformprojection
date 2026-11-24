import { cn } from '../../lib/utils'

export function Card({ className = '', children, ...props }) {
  return (
    <div className={cn('glass rounded-2xl p-5 sm:p-6', className)} {...props}>
      {children}
    </div>
  )
}

export function Badge({ children, tone = 'default', className = '' }) {
  const tones = {
    default: 'bg-white/8 text-slate-200 ring-white/10',
    success: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/20',
    warning: 'bg-amber-500/15 text-amber-300 ring-amber-400/20',
    danger: 'bg-rose-500/15 text-rose-300 ring-rose-400/20',
    info: 'bg-sky-500/15 text-sky-300 ring-sky-400/20',
    muted: 'bg-slate-500/15 text-slate-300 ring-slate-400/20',
  }
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset', tones[tone] || tones.default, className)}>{children}</span>
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400/50'
  const variants = {
    primary: 'bg-aqua-500 text-ocean-950 hover:bg-aqua-400 shadow-lg shadow-teal-950/30',
    secondary: 'bg-white/8 text-white hover:bg-white/12 ring-1 ring-inset ring-white/10',
    ghost: 'text-slate-200 hover:bg-white/8',
    danger: 'bg-rose-500/90 text-white hover:bg-rose-500',
  }
  const sizes = { sm: 'px-3 py-2 text-sm', md: 'px-4 py-2.5 text-sm', lg: 'px-5 py-3 text-base' }
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props}>{children}</button>
}

export function PageHeader({ title, subtitle, actions, eyebrow }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-aqua-300/80">{eyebrow}</div>}
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-3xl text-sm text-slate-400 sm:text-base">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function StatCard({ label, value, icon: Icon, tone = 'aqua', subtext }) {
  const tones = {
    aqua: 'text-aqua-300 bg-aqua-500/15 ring-aqua-400/20',
    sky: 'text-sky-300 bg-sky-500/15 ring-sky-400/20',
    amber: 'text-amber-300 bg-amber-500/15 ring-amber-400/20',
    rose: 'text-rose-300 bg-rose-500/15 ring-rose-400/20',
    emerald: 'text-emerald-300 bg-emerald-500/15 ring-emerald-400/20',
  }
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-white">{value}</p>
          {subtext && <p className="mt-2 text-xs text-slate-400">{subtext}</p>}
        </div>
        {Icon && (
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-inset', tones[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
    </Card>
  )
}