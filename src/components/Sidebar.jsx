import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Users, Sparkles, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: BookOpen,        label: 'Lessons',   to: '/lessons'   },
  { icon: Users,           label: 'Community', to: '/community' },
  { icon: Sparkles,        label: 'AI Coach',  to: '/ai-coach'  },
]

export default function Sidebar({ open, onClose }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 flex flex-col shrink-0
        bg-slate-900 text-white
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 h-16 px-5 border-b border-white/10 shrink-0">
        <span className="text-base font-semibold tracking-tight">Alan</span>
        <span className="text-[11px] font-medium text-slate-400 bg-white/10 px-1.5 py-0.5 rounded mt-px">
          Studio
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="App navigation">
        {NAV.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User strip */}
      <div className="px-3 py-3 border-t border-white/10 shrink-0 space-y-0.5">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate leading-tight">
              {user?.user_metadata?.full_name ?? 'Student'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors duration-150"
        >
          <LogOut size={17} strokeWidth={1.75} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
