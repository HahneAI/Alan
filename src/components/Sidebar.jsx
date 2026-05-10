import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Users, Sparkles, Mail, Shield, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_MAIN = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: BookOpen,        label: 'Lessons',   to: '/lessons'   },
  { icon: Users,           label: 'Community', to: '/community' },
  { icon: Sparkles,        label: 'AI Coach',  to: '/ai-coach'  },
  { icon: Mail,            label: 'Messages',  to: '/messages', badge: 3 },
]

export default function Sidebar({ open, onClose }) {
  const { user, profile, signOut } = useAuth()
  const navigate  = useNavigate()
  const isAdmin   = profile?.is_admin === true

  const nav = [
    ...NAV_MAIN,
    ...(isAdmin ? [{ icon: Shield, label: 'Admin', to: '/admin' }] : []),
    { icon: Settings, label: 'Settings', to: '/settings' },
  ]

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
      {/*
        pt-safe: logo row clears the Dynamic Island on edge-to-edge devices.
        pb-safe: user strip clears the home indicator bar at the bottom.
      */}

      {/* Logo */}
      <div className="flex items-center gap-2 px-5 border-b border-white/10 shrink-0 pt-safe" style={{ minHeight: 'calc(4rem + env(safe-area-inset-top, 0px))' }}>
        <span className="text-base font-semibold tracking-tight">Alan</span>
        <span className="text-[11px] font-medium text-slate-400 bg-white/10 px-1.5 py-0.5 rounded mt-px">
          Studio
        </span>
      </div>

      {/* Navigation — py-3 gives each link a 44px+ touch target */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto" aria-label="App navigation">
        {nav.map(({ icon: Icon, label, to, badge }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
            <span className="flex-1">{label}</span>
            {badge != null && (
              <span className="text-[10px] font-bold bg-blue-500 text-white w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User strip — pb-safe clears the home indicator */}
      <div className="px-3 py-3 border-t border-white/10 shrink-0 space-y-0.5 pb-safe">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate leading-tight">
              {user?.user_metadata?.full_name ?? 'Student'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        {/* py-3 = 44px touch target */}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors duration-150"
        >
          <LogOut size={17} strokeWidth={1.75} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
