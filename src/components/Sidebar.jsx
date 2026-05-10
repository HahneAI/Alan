import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Users, Sparkles, Mail,
  Shield, Settings, LogOut, Bell,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_MAIN = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: BookOpen,        label: 'Lessons',   to: '/lessons',   soon: true },
  { icon: Users,           label: 'Community', to: '/community', soon: true },
  { icon: Sparkles,        label: 'AI Coach',  to: '/ai-coach',  soon: true },
  { icon: Mail,            label: 'Messages',  to: '/messages',  badge: 3   },
]

export default function Sidebar({ open, onClose }) {
  const { user, profile, signOut } = useAuth()
  const navigate  = useNavigate()
  const isAdmin   = profile?.is_admin === true
  const [notifOpen, setNotifOpen] = useState(false)

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
      {/* Logo — pt-safe clears the Dynamic Island on edge-to-edge devices */}
      <div
        className="flex items-center gap-2 px-5 border-b border-white/10 shrink-0 pt-safe"
        style={{ minHeight: 'calc(4rem + env(safe-area-inset-top, 0px))' }}
      >
        <span className="text-base font-semibold tracking-tight">Alan</span>
        <span className="text-[11px] font-medium text-slate-400 bg-white/10 px-1.5 py-0.5 rounded mt-px">
          Studio
        </span>
      </div>

      {/* Navigation — py-3 = 44px touch targets */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto" aria-label="App navigation">
        {nav.map(({ icon: Icon, label, to, badge, soon }) => (
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
            {/* Coming-soon amber dot — signals feature is not yet live */}
            {soon && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"
                aria-label="Coming soon"
              />
            )}
            {/* Unread count badge */}
            {badge != null && (
              <span className="text-[10px] font-bold bg-blue-500 text-white w-4 h-4 rounded-full flex items-center justify-center leading-none shrink-0">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer — pb-safe clears the home indicator */}
      <div className="px-3 pt-3 pb-3 border-t border-white/10 shrink-0 space-y-0.5 pb-safe">

        {/* Notification bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            className="relative flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors duration-150"
          >
            <Bell size={17} strokeWidth={1.75} aria-hidden="true" />
            <span className="flex-1 font-medium">Notifications</span>
            {/* Red dot — hardcoded unread indicator */}
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" aria-label="New notifications" />
          </button>

          {/* Dropdown panel — floats above the bell */}
          {notifOpen && (
            <>
              {/* Click-outside backdrop */}
              <div
                className="fixed inset-0 z-10"
                aria-hidden="true"
                onClick={() => setNotifOpen(false)}
              />
              <div className="absolute bottom-full left-0 right-0 mb-2 z-20 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Notifications</p>
                </div>
                <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
                  <Bell size={20} strokeWidth={1.25} className="text-slate-300" aria-hidden="true" />
                  <p className="text-xs font-medium text-slate-400">No notifications yet</p>
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-600 px-2.5 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User display */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          {/* Avatar — shows uploaded photo if set, otherwise initials */}
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              : initials
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate leading-tight">
              {user?.user_metadata?.full_name ?? 'Student'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Sign out — py-3 = 44px touch target */}
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
