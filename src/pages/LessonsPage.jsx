import { useState } from 'react'
import { Lock } from 'lucide-react'

const TABS = ['All', 'In Progress', 'Completed']

const FILTER_CHIPS = ['All topics', 'Fundamentals', 'Delivery', 'Advanced']

const COURSES = [
  {
    id: 1,
    title: 'Finding Your Voice',
    subtitle: 'Module 1 · 8 lessons',
    total: 8,
    completed: 0,
    gradient: 'from-blue-400 to-indigo-500',
    badge: 'new',
    locked: false,
  },
  {
    id: 2,
    title: 'Vocal Confidence',
    subtitle: 'Module 2 · 10 lessons',
    total: 10,
    completed: 6,
    gradient: 'from-violet-400 to-purple-500',
    badge: null,
    locked: false,
  },
  {
    id: 3,
    title: 'Public Speaking Fundamentals',
    subtitle: 'Module 3 · 12 lessons',
    total: 12,
    completed: 0,
    gradient: 'from-emerald-400 to-teal-500',
    badge: 'coming-soon',
    locked: true,
  },
  {
    id: 4,
    title: 'The Art of Persuasion',
    subtitle: 'Module 4 · 9 lessons',
    total: 9,
    completed: 0,
    gradient: 'from-amber-400 to-orange-500',
    badge: 'coming-soon',
    locked: true,
  },
]

export default function LessonsPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [activeFilter, setActiveFilter] = useState('All topics')

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Lessons</h2>
        <p className="text-sm text-slate-500 mt-1.5">Your curriculum</p>
      </div>

      {/* Tabs — py-3 = 44px touch target */}
      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors duration-150 ${
              activeTab === tab
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setActiveFilter(chip)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 ${
              activeFilter === chip
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Course catalog */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <p className="text-sm font-semibold text-slate-700">Your courses</p>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {COURSES.length}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {COURSES.map((course) => {
            const pct = Math.round((course.completed / course.total) * 100)
            return (
              <div
                key={course.id}
                className={`bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm ${
                  course.locked ? 'opacity-75' : ''
                }`}
              >
                {/* Cover */}
                <div className={`h-32 bg-gradient-to-br ${course.gradient} relative`}>
                  {course.locked && (
                    <div className="absolute inset-0 bg-slate-900/25 flex items-center justify-center">
                      <Lock size={22} strokeWidth={1.75} className="text-white/80" aria-hidden="true" />
                    </div>
                  )}
                  {course.badge === 'new' && (
                    <span className="absolute top-3.5 right-3.5 text-[10px] font-bold uppercase tracking-wide bg-white text-blue-600 px-2 py-0.5 rounded-full shadow-sm">
                      New
                    </span>
                  )}
                  {course.badge === 'coming-soon' && (
                    <span className="absolute top-3.5 right-3.5 text-[10px] font-bold uppercase tracking-wide bg-slate-900/60 text-white px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-5">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">{course.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{course.subtitle}</p>
                  <div className="mt-4">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      {course.completed} of {course.total} lessons
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
