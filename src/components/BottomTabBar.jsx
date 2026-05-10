import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Sparkles, Users, Mail } from 'lucide-react'

const TABS = [
  { icon: LayoutDashboard, label: 'Home',      to: '/dashboard' },
  { icon: BookOpen,        label: 'Lessons',   to: '/lessons'   },
  { icon: Sparkles,        label: 'AI Coach',  to: '/ai-coach'  },
  { icon: Users,           label: 'Community', to: '/community' },
  { icon: Mail,            label: 'Messages',  to: '/messages'  },
]

export default function BottomTabBar() {
  return (
    /*
      lg:hidden — the bottom tab bar only exists on mobile/tablet.
      pb-safe   — clears the home indicator on edge-to-edge iPhones.
      z-20      — above page content, below the sidebar overlay (z-30).
    */
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-200 pb-safe"
      aria-label="Mobile navigation"
    >
      <div className="flex h-16">
        {TABS.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-150 ${
                isActive ? 'text-slate-900' : 'text-slate-400'
              }`
            }
          >
            <Icon size={21} strokeWidth={1.75} aria-hidden="true" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
