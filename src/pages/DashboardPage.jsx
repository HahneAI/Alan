import { Link } from 'react-router-dom'
import { BookOpen, Users, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const QUICK_LINKS = [
  {
    icon: BookOpen,
    label: 'Continue Lesson',
    description: 'Pick up where you left off',
    to: '/lessons',
    accent: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Users,
    label: 'Community',
    description: 'Connect with fellow students',
    to: '/community',
    accent: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Sparkles,
    label: 'AI Coach',
    description: "Get feedback from Alan's AI",
    to: '/ai-coach',
    accent: 'bg-violet-50 text-violet-600',
  },
]

const STATS = [
  { label: 'Lessons completed', value: '—' },
  { label: 'Practice sessions',  value: '—' },
  { label: 'AI conversations',   value: '—' },
  { label: 'Community posts',    value: '—' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="max-w-4xl space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back, {firstName}
        </h2>
        <p className="text-sm text-slate-500 mt-1">Here&apos;s what&apos;s happening in your studio.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map(({ label, value }) => (
          <div key={label} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-1 leading-snug">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Quick access
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {QUICK_LINKS.map(({ icon: Icon, label, description, to, accent }) => (
            <Link
              key={to}
              to={to}
              className="flex items-start gap-3.5 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors duration-150"
            >
              <div className={`w-9 h-9 rounded-lg ${accent} flex items-center justify-center shrink-0`}>
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
