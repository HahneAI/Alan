import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/lessons':   'Lessons',
  '/community': 'Community',
  '/ai-coach':  'AI Coach',
}

export default function TopBar({ onMenuClick }) {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] ?? 'Alan Studio'

  return (
    <header className="flex items-center h-16 px-4 sm:px-6 bg-white border-b border-slate-100 shrink-0">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors mr-3"
      >
        <Menu size={20} aria-hidden="true" />
      </button>
      <h1 className="text-sm font-semibold text-slate-900">{title}</h1>
    </header>
  )
}
