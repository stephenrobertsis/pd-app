import { useState } from 'react'
import { AlertTriangle, CheckCircle, XCircle, Zap, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Plus } from 'lucide-react'
import { recommendations as initialRecs } from '../data/mockData'

const priorityConfig = {
  critical: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' },
  high: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
  medium: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500' },
  low: { color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', dot: 'bg-slate-400' },
}

const statusConfig = {
  pending: { label: 'Pending', color: 'text-slate-500', bg: 'bg-slate-100' },
  adopted: { label: 'Adopted', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  dismissed: { label: 'Dismissed', color: 'text-slate-400', bg: 'bg-slate-100' },
}

const CADENCES = ['all', 'daily', 'weekly', 'monthly', 'quarterly']

function RecCard({ rec, onAdopt, onDismiss, onFeedback }) {
  const [expanded, setExpanded] = useState(false)
  const [feedbackText, setFeedbackText] = useState(rec.feedback || '')
  const [editingFeedback, setEditingFeedback] = useState(false)
  const pcfg = priorityConfig[rec.priority]
  const scfg = statusConfig[rec.status]

  return (
    <div className={`bg-white rounded-xl border ${rec.status === 'dismissed' ? 'opacity-60' : ''} border-slate-200 overflow-hidden`}>
      {/* Card header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${pcfg.dot}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{rec.title}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${scfg.bg} ${scfg.color}`}>
                {scfg.label}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium capitalize px-1.5 py-0.5 rounded ${pcfg.bg} ${pcfg.color}`}>
                {rec.priority}
              </span>
              <span className="text-xs text-slate-400 capitalize">{rec.cadence}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-400">{rec.category}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 mt-3 ml-5">{rec.insight}</p>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-5 mt-2 flex items-center gap-1 text-xs text-teal-600 font-medium hover:text-teal-700"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? 'Hide details' : 'View recommended action'}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-100 p-4 bg-slate-50 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Recommended Action</p>
            <p className="text-sm text-slate-700">{rec.action}</p>
          </div>
          <div className="flex gap-4">
            <div>
              <p className="text-xs text-slate-400">Effort</p>
              <p className="text-sm font-medium text-slate-700">{rec.effort}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Impact</p>
              <p className="text-sm font-medium text-slate-700">{rec.impact}</p>
            </div>
            {rec.adoptedDate && (
              <div>
                <p className="text-xs text-slate-400">Adopted</p>
                <p className="text-sm font-medium text-slate-700">{rec.adoptedDate}</p>
              </div>
            )}
          </div>

          {/* Feedback */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Your Feedback</p>
            {editingFeedback ? (
              <div className="space-y-2">
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={2}
                  placeholder="Add your notes or feedback..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { onFeedback(rec.id, feedbackText); setEditingFeedback(false) }}
                    className="text-xs px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingFeedback(false)}
                    className="text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setEditingFeedback(true)}
                className="min-h-[36px] text-sm text-slate-600 border border-dashed border-slate-200 rounded-lg p-2.5 cursor-text hover:border-teal-400 transition-colors"
              >
                {feedbackText || <span className="text-slate-400">Click to add feedback...</span>}
              </div>
            )}
          </div>

          {/* Actions */}
          {rec.status === 'pending' && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onAdopt(rec.id)}
                className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                <ThumbsUp size={13} />
                Adopt Action
              </button>
              <button
                onClick={() => onDismiss(rec.id)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ThumbsDown size={13} />
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Recommendations() {
  const [recs, setRecs] = useState(initialRecs)
  const [filter, setFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = recs.filter(r => {
    const matchCadence = filter === 'all' || r.cadence === filter
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchCadence && matchStatus
  })

  const adopt = (id) => setRecs(prev =>
    prev.map(r => r.id === id ? { ...r, status: 'adopted', adoptedDate: 'Jun 21, 2025' } : r)
  )
  const dismiss = (id) => setRecs(prev =>
    prev.map(r => r.id === id ? { ...r, status: 'dismissed' } : r)
  )
  const saveFeedback = (id, text) => setRecs(prev =>
    prev.map(r => r.id === id ? { ...r, feedback: text } : r)
  )

  const counts = {
    pending: recs.filter(r => r.status === 'pending').length,
    adopted: recs.filter(r => r.status === 'adopted').length,
    dismissed: recs.filter(r => r.status === 'dismissed').length,
  }

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Recommendations</h1>
        <p className="text-sm text-slate-500 mt-0.5">AI-generated actions based on your operational reports</p>
      </div>

      {/* Summary row */}
      <div className="flex gap-3">
        {[
          { label: 'Pending', count: counts.pending, color: 'text-amber-600', bg: 'bg-amber-50', key: 'pending' },
          { label: 'Adopted', count: counts.adopted, color: 'text-emerald-600', bg: 'bg-emerald-50', key: 'adopted' },
          { label: 'Dismissed', count: counts.dismissed, color: 'text-slate-500', bg: 'bg-slate-50', key: 'dismissed' },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(statusFilter === s.key ? 'all' : s.key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              statusFilter === s.key ? `${s.bg} border-transparent` : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className={`text-lg font-bold ${s.color}`}>{s.count}</span>
            <span className="text-slate-600">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Cadence filter */}
      <div className="flex bg-slate-100 rounded-lg p-1 gap-1 w-fit">
        {CADENCES.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
              filter === c ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">No recommendations match this filter.</div>
        ) : (
          filtered.map(rec => (
            <RecCard
              key={rec.id}
              rec={rec}
              onAdopt={adopt}
              onDismiss={dismiss}
              onFeedback={saveFeedback}
            />
          ))
        )}
      </div>
    </div>
  )
}
