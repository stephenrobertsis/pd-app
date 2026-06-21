import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import { kpiData } from '../data/mockData'

const CADENCES = ['daily', 'weekly', 'monthly', 'quarterly']

function MetricCard({ metric }) {
  const pct = Math.round((metric.value / metric.target) * 100)
  const isRevenue = metric.unit === '$'
  const display = isRevenue
    ? `$${(metric.value / 1000).toFixed(0)}K`
    : `${metric.value}${metric.unit}`
  const targetDisplay = isRevenue
    ? `$${(metric.target / 1000).toFixed(0)}K`
    : `${metric.target}${metric.unit}`
  const trendUp = metric.trend > 0
  const statusColor = {
    ok: 'border-l-emerald-500',
    warning: 'border-l-amber-400',
    critical: 'border-l-red-500',
  }[metric.status]

  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${statusColor} p-4`}>
      <p className="text-sm text-slate-500 font-medium mb-2">{metric.label}</p>
      <div className="flex items-end justify-between mb-1">
        <span className="text-2xl font-bold text-slate-900">{display}</span>
        <span className={`text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
          {trendUp ? '+' : ''}{metric.trend}%
        </span>
      </div>
      <p className="text-xs text-slate-400 mb-2">Target: {targetDisplay}</p>
      <div className="w-full bg-slate-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${
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

export default function Reports() {
  const [cadence, setCadence] = useState('weekly')
  const data = kpiData[cadence]

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Operational Reports</h1>
          <p className="text-sm text-slate-500 mt-0.5">{data.period || data.date}</p>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
          {CADENCES.map(c => (
            <button
              key={c}
              onClick={() => setCadence(c)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                cadence === c
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {data.metrics.map(m => <MetricCard key={m.label} metric={m} />)}
      </div>

      {/* Charts */}
      {cadence === 'weekly' && data.visitChart && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Daily Visit Volume</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.visitChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip />
              <Bar dataKey="visits" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {cadence === 'monthly' && data.healChart && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Admitted vs Healed (5-Month Trend)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.healChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="admitted" stroke="#94a3b8" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="healed" stroke="#0d9488" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {cadence === 'quarterly' && data.quarterlyChart && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Quarterly Visits & Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.quarterlyChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v, name) => name === 'revenue' ? `$${(v/1000).toFixed(0)}K` : v} />
              <Legend />
              <Bar yAxisId="left" dataKey="visits" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
