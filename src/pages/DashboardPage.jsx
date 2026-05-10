import { Link } from 'react-router-dom'
import { BookOpen, Users, Sparkles, Flame, MessageSquare, Play } from 'lucide-react'
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

const ACTIVITY = [
  { icon: BookOpen,      color: 'text-emerald-500', label: 'Completed "Finding Your Voice"',  time: '2h ago'    },
  { icon: Sparkles,      color: 'text-violet-500',  label: 'AI Coach conversation',            time: '5h ago'    },
  { icon: MessageSquare, color: 'text-blue-500',    label: 'Posted in Community',              time: 'Yesterday' },
  { icon: Play,          color: 'text-amber-500',   label: 'Started "Vocal Confidence"',       time: '2 days ago'},
]

function StatShimmer({ label }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
      <div className="h-7 w-10 bg-slate-200 animate-pulse rounded mb-2" />
      <p className="text-xs text-slate-500 leading-snug">{label}</p>
    </div>
  )
}

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

      {/* Resume banner */}
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <BookOpen size={20} strokeWidth={1.75} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            Continue where you left off
          </p>
          <p className="text-sm font-semibold text-slate-900 truncate">Module 2 · Vocal Confidence</p>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-[62%] bg-blue-500 rounded-full" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">62% complete</p>
        </div>
        <Link
          to="/lessons"
          className="shrink-0 inline-flex items-center bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-150"
        >
          Continue
        </Link>
      </div>

      {/* Stats */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Your progress</p>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-1.5">
              <Flame size={18} className="text-amber-500 shrink-0" aria-hidden="true" />
              <p className="text-2xl font-bold text-slate-900">7</p>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-snug">Day streak</p>
          </div>
          <StatShimmer label="Lessons completed" />
          <StatShimmer label="Practice sessions" />
          <StatShimmer label="AI conversations" />
          <StatShimmer label="Community posts" />
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent activity</p>
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm divide-y divide-slate-50">
          {ACTIVITY.map(({ icon: Icon, color, label, time }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3">
              <Icon size={15} strokeWidth={1.75} className={`${color} shrink-0`} aria-hidden="true" />
              <p className="text-sm text-slate-700 flex-1 min-w-0 truncate">{label}</p>
              <p className="text-xs text-slate-400 shrink-0">{time}</p>
            </div>
          ))}
        </div>
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
