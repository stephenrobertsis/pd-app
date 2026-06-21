import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, XCircle, Clock, Zap } from 'lucide-react'
import { kpiData, recommendations, actions } from '../data/mockData'

function StatusBadge({ status }) {
  const map = {
    ok: { color: 'bg-emerald-50 text-emerald-700', label: 'On Track' },
    warning: { color: 'bg-amber-50 text-amber-700', label: 'Watch' },
    critical: { color: 'bg-red-50 text-red-700', label: 'Off Track' },
  }
  const s = map[status] || map.ok
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>
      {s.label}
    </span>
  )
}

function KpiCard({ metric }) {
  const pct = Math.round((metric.value / metric.target) * 100)
  const isRevenue = metric.unit === '$'
  const display = isRevenue
    ? `$${(metric.value / 1000).toFixed(0)}K`
    : `${metric.value}${metric.unit}`
  const targetDisplay = isRevenue
    ? `$${(metric.target / 1000).toFixed(0)}K`
    : `${metric.target}${metric.unit}`

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-slate-500 font-medium">{metric.label}</p>
        <StatusBadge status={metric.status} />
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-1">{display}</p>
      <p className="text-xs text-slate-400 mb-3">Target: {targetDisplay}</p>
      <div className="w-full bg-slate-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all ${
            metric.status === 'ok' ? 'bg-emerald-500' :
            metric.status === 'warning' ? 'bg-amber-400' : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1">{pct}% of target</p>
    </div>
  )
}

const priorityConfig = {
  critical: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle },
  high: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle },
  medium: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Zap },
  low: { color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: Minus },
}

const statusConfig = {
  todo: { color: 'text-slate-500', label: 'To Do', icon: Clock },
  'in-progress': { color: 'text-blue-600', label: 'In Progress', icon: Zap },
  completed: { color: 'text-emerald-600', label: 'Completed', icon: CheckCircle },
}

export default function Dashboard() {
  const weeklyMetrics = kpiData.weekly.metrics
  const pendingRecs = recommendations.filter(r => r.status === 'pending').slice(0, 3)
  const activeActions = actions.filter(a => a.status !== 'completed')
  const completedActions = actions.filter(a => a.status === 'completed')

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Good morning</h1>
        <p className="text-sm text-slate-500 mt-0.5">Saturday, June 21, 2025 · Center #4217</p>
      </div>

      {/* Alert strip */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800">3 items need your attention this week</p>
          <p className="text-sm text-amber-700 mt-0.5">
            New patient volume is 25% below target · HBO utilization below goal · Revenue shortfall audit in progress
          </p>
        </div>
      </div>

      {/* Weekly KPIs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Weekly Snapshot</h2>
          <span className="text-xs text-slate-400">{kpiData.weekly.period}</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {weeklyMetrics.map(m => <KpiCard key={m.label} metric={m} />)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending recommendations */}
        <div>
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Pending Recommendations</h2>
          <div className="space-y-2">
            {pendingRecs.map(rec => {
              const cfg = priorityConfig[rec.priority]
              const Icon = cfg.icon
              return (
                <div key={rec.id} className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
                  <div className="flex items-start gap-2">
                    <Icon size={14} className={`${cfg.color} mt-0.5 shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{rec.title}</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{rec.action}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-400 capitalize">{rec.cadence}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-400">{rec.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Active actions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Active Actions</h2>
            <span className="text-xs text-slate-400">{completedActions.length} of {actions.length} complete</span>
          </div>
          <div className="space-y-2">
            {activeActions.map(act => {
              const scfg = statusConfig[act.status]
              const pcfg = priorityConfig[act.priority]
              const StatusIcon = scfg.icon
              return (
                <div key={act.id} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{act.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Due {act.dueDate} · {act.owner}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${pcfg.bg} ${pcfg.color}`}>
                      {act.priority}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 mt-2 ${scfg.color}`}>
                    <StatusIcon size={12} />
                    <span className="text-xs font-medium">{scfg.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
