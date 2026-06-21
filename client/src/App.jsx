import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Lightbulb, CheckSquare } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import Recommendations from './pages/Recommendations'
import ActionManager from './pages/ActionManager'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/recommendations', icon: Lightbulb, label: 'Recommendations' },
  { to: '/actions', icon: CheckSquare, label: 'Action Manager' },
]

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-5 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">H</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 leading-tight">Healogics</p>
                <p className="text-xs text-slate-500 leading-tight">Wound Care Center</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-0.5">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                <span className="text-teal-700 text-xs font-semibold">PD</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Program Director</p>
                <p className="text-xs text-slate-500">Center #4217</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/actions" element={<ActionManager />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
