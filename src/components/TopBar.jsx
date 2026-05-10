import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/lessons':   'Lessons',
  '/community': 'Community',
  '/ai-coach':  'AI Coach',
  '/settings':  'Settings',
}

export default function TopBar({ onMenuClick }) {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] ?? 'Alan Studio'

  return (
    /*
      pt-safe pushes the header content below the Dynamic Island on
      edge-to-edge devices (viewport-fit=cover). The background fills
      the full safe-area-inset-top region so the island sits on white.
    */
    <header className="shrink-0 bg-white border-b border-slate-100 pt-safe">
      <div className="flex items-center h-16 px-4 sm:px-6">
        {/* 44×44 touch target — Apple HIG minimum */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="lg:hidden flex items-center justify-center w-11 h-11 -ml-1 rounded-xl text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors mr-2"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
        <h1 className="text-sm font-semibold text-slate-900">{title}</h1>
      </div>
    </header>
  )
}
