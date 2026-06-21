import { useState } from 'react'
import { Plus, X, CheckCircle, Clock, Zap, AlertTriangle, Link2, Edit2, Check } from 'lucide-react'
import { actions as initialActions } from '../data/mockData'

const STATUS_COLS = [
  { id: 'todo', label: 'To Do', color: 'bg-slate-100', headerColor: 'text-slate-600' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-blue-50', headerColor: 'text-blue-700' },
  { id: 'completed', label: 'Completed', color: 'bg-emerald-50', headerColor: 'text-emerald-700' },
]

const priorityConfig = {
  critical: { color: 'text-red-600', bg: 'bg-red-100', label: 'Critical' },
  high: { color: 'text-amber-600', bg: 'bg-amber-100', label: 'High' },
  medium: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Medium' },
  low: { color: 'text-slate-500', bg: 'bg-slate-100', label: 'Low' },
}

const statusIcon = {
  todo: <Clock size={12} className="text-slate-400" />,
  'in-progress': <Zap size={12} className="text-blue-500" />,
  completed: <CheckCircle size={12} className="text-emerald-500" />,
}

function ActionCard({ action, onStatusChange, onEdit }) {
  const [editingNote, setEditingNote] = useState(false)
  const [note, setNote] = useState(action.notes || '')
  const pcfg = priorityConfig[action.priority]

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900 leading-snug">{action.title}</p>
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded shrink-0 ${pcfg.bg} ${pcfg.color}`}>
          {pcfg.label}
        </span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">{action.description}</p>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span>Due {action.dueDate}</span>
        <span>·</span>
        <span>{action.owner}</span>
        {action.source === 'recommendation' && (
          <>
            <span>·</span>
            <span className="flex items-center gap-0.5 text-teal-600">
              <Link2 size={10} />
              From rec
            </span>
          </>
        )}
      </div>

      {/* Notes */}
      <div>
        {editingNote ? (
          <div className="space-y-1.5">
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={2}
              placeholder="Add notes..."
              autoFocus
            />
            <div className="flex gap-1.5">
              <button
                onClick={() => { onEdit(action.id, note); setEditingNote(false) }}
                className="text-xs px-2 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditingNote(false)}
                className="text-xs px-2 py-1 border border-slate-200 text-slate-600 rounded hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditingNote(true)}
            className="w-full text-left text-xs text-slate-400 hover:text-slate-600 flex items-start gap-1 group"
          >
            <Edit2 size={10} className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            {note || 'Add note...'}
          </button>
        )}
      </div>

      {/* Status change */}
      <div className="flex gap-1 pt-1 border-t border-slate-100">
        {STATUS_COLS.map(col => (
          <button
            key={col.id}
            onClick={() => onStatusChange(action.id, col.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs font-medium transition-colors ${
              action.status === col.id
                ? 'bg-teal-600 text-white'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {statusIcon[col.id]}
            {col.id === 'todo' ? 'To Do' : col.id === 'in-progress' ? 'Active' : 'Done'}
          </button>
        ))}
      </div>
    </div>
  )
}

const emptyNew = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  owner: 'Program Director',
  notes: '',
}

export default function ActionManager() {
  const [actions, setActions] = useState(initialActions)
  const [showNew, setShowNew] = useState(false)
  const [newAction, setNewAction] = useState(emptyNew)

  const changeStatus = (id, status) =>
    setActions(prev => prev.map(a => a.id === id ? { ...a, status } : a))

  const editNote = (id, notes) =>
    setActions(prev => prev.map(a => a.id === id ? { ...a, notes } : a))

  const addAction = () => {
    if (!newAction.title.trim()) return
    const action = {
      ...newAction,
      id: `act-${Date.now()}`,
      source: 'custom',
      recId: null,
      status: 'todo',
      createdDate: new Date().toISOString().split('T')[0],
    }
    setActions(prev => [action, ...prev])
    setNewAction(emptyNew)
    setShowNew(false)
  }

  return (
    <div className="p-6 space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Action Manager</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track adopted recommendations and your own commitments</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus size={15} />
          Add Action
        </button>
      </div>

      {/* New action form */}
      {showNew && (
        <div className="bg-white border border-teal-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">New Action</p>
            <button onClick={() => setShowNew(false)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Action title *"
            value={newAction.title}
            onChange={e => setNewAction(p => ({ ...p, title: e.target.value }))}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <textarea
            placeholder="Description (optional)"
            value={newAction.description}
            onChange={e => setNewAction(p => ({ ...p, description: e.target.value }))}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={2}
          />
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">Priority</label>
              <select
                value={newAction.priority}
                onChange={e => setNewAction(p => ({ ...p, priority: e.target.value }))}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">Due Date</label>
              <input
                type="date"
                value={newAction.dueDate}
                onChange={e => setNewAction(p => ({ ...p, dueDate: e.target.value }))}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">Owner</label>
              <input
                type="text"
                value={newAction.owner}
                onChange={e => setNewAction(p => ({ ...p, owner: e.target.value }))}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowNew(false)}
              className="px-4 py-2 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={addAction}
              className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
              disabled={!newAction.title.trim()}
            >
              Add Action
            </button>
          </div>
        </div>
      )}

      {/* Kanban columns */}
      <div className="grid grid-cols-3 gap-4">
        {STATUS_COLS.map(col => {
          const colActions = actions.filter(a => a.status === col.id)
          return (
            <div key={col.id} className={`rounded-xl p-3 ${col.color}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold uppercase tracking-wide ${col.headerColor}`}>
                  {col.label}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white ${col.headerColor}`}>
                  {colActions.length}
                </span>
              </div>
              <div className="space-y-3">
                {colActions.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">No actions</div>
                ) : (
                  colActions.map(action => (
                    <ActionCard
                      key={action.id}
                      action={action}
                      onStatusChange={changeStatus}
                      onEdit={editNote}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
