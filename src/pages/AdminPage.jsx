import { useState } from 'react'
import { Search, Pencil, GripVertical, X, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'

// ── Mock data ─────────────────────────────────────────────────────

const USERS = [
  { id: 1, initials: 'AM', name: 'Alex M.',   email: 'alex@example.com',   roles: ['Student'], color: 'bg-blue-500',    joined: 'Jan 5, 2026'   },
  { id: 2, initials: 'SK', name: 'Sarah K.',  email: 'sarah@example.com',  roles: ['Student'], color: 'bg-emerald-500', joined: 'Jan 8, 2026'   },
  { id: 3, initials: 'JT', name: 'Jordan T.', email: 'jordan@example.com', roles: ['Coach'],   color: 'bg-violet-500', joined: 'Dec 20, 2025'  },
  { id: 4, initials: 'MR', name: 'Maya R.',   email: 'maya@example.com',   roles: ['Student'], color: 'bg-amber-500',  joined: 'Jan 12, 2026'  },
  { id: 5, initials: 'CD', name: 'Chris D.',  email: 'chris@example.com',  roles: ['Admin'],   color: 'bg-slate-600',  joined: 'Nov 15, 2025'  },
]

const COURSES = [
  { id: 1, title: 'Finding Your Voice',             lessons: 8,  published: true  },
  { id: 2, title: 'Vocal Confidence',               lessons: 10, published: true  },
  { id: 3, title: 'Public Speaking Fundamentals',   lessons: 12, published: false },
]

const ROLE_CHIP = {
  Student: 'bg-slate-100 text-slate-600',
  Coach:   'bg-blue-50 text-blue-700',
  Admin:   'bg-violet-100 text-violet-700',
}

const TABS = ['Users', 'Courses', 'Community', 'Stats']

// ── Sub-components ────────────────────────────────────────────────

function StatShimmer({ label }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <div className="h-7 w-12 bg-slate-200 animate-pulse rounded mb-2.5" />
      <p className="text-xs text-slate-500 leading-snug">{label}</p>
    </div>
  )
}

function Toggle({ label, hint }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-50 last:border-0">
      <div className="min-w-0 mr-4">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      </div>
      <button
        type="button"
        disabled
        title="Coming soon"
        className="relative w-10 h-6 rounded-full bg-slate-200 cursor-not-allowed shrink-0"
        aria-label={label}
      >
        <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
      </button>
    </div>
  )
}

function EditDrawer({ user, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/20"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-40 w-80 bg-white border-l border-slate-100 shadow-2xl flex flex-col pt-safe pb-safe">

        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-900">Edit user</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X size={16} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

          {/* Avatar + name */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${user.color} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
              {user.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          {/* Display name field */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Display name
            </label>
            <input
              type="text"
              disabled
              value={user.name}
              title="Coming soon"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed opacity-60 outline-none"
            />
          </div>

          {/* Email field — always read-only */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              readOnly
              value={user.email}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-400 cursor-default outline-none"
            />
          </div>

          {/* Role + permission toggles */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Permissions
            </p>
            <div className="bg-slate-50 rounded-xl px-4 divide-y divide-slate-100">
              <Toggle label="Coach"              hint="Can host sessions and view all submissions" />
              <Toggle label="Admin"              hint="Full platform management access" />
              <Toggle label="Direct messaging"   hint="Allow this student to message others" />
            </div>
          </div>
        </div>

        {/* Drawer footer */}
        <div className="px-5 py-4 border-t border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 text-sm font-medium text-slate-600 bg-slate-100 px-4 py-2.5 rounded-xl hover:bg-slate-200 transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled
            title="Coming soon"
            className="flex-1 text-sm font-medium text-white bg-slate-900 px-4 py-2.5 rounded-xl cursor-not-allowed opacity-50 min-h-[44px]"
          >
            Save changes
          </button>
        </div>

      </div>
    </>
  )
}

// ── Tab panels ────────────────────────────────────────────────────

function UsersTab({ onEdit }) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={15} strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search students…"
          disabled
          title="Coming soon"
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 cursor-not-allowed opacity-60 outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[2fr_2fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Name</p>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email</p>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Role</p>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Joined</p>
          <span className="sr-only">Actions</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-50">
          {USERS.map((u) => (
            <div key={u.id} className="flex sm:grid sm:grid-cols-[2fr_2fr_auto_auto_auto] items-center gap-4 px-5 py-4">
              {/* Name + avatar */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-full ${u.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                  {u.initials}
                </div>
                <p className="text-sm font-medium text-slate-900 truncate">{u.name}</p>
              </div>

              {/* Email — hidden on mobile */}
              <p className="hidden sm:block text-sm text-slate-500 truncate">{u.email}</p>

              {/* Role chips */}
              <div className="hidden sm:flex gap-1.5 flex-wrap">
                {u.roles.map((r) => (
                  <span key={r} className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${ROLE_CHIP[r]}`}>
                    {r}
                  </span>
                ))}
              </div>

              {/* Joined — hidden on mobile */}
              <p className="hidden sm:block text-xs text-slate-400 whitespace-nowrap">{u.joined}</p>

              {/* Edit button — 44px touch target */}
              <button
                type="button"
                onClick={() => onEdit(u)}
                aria-label={`Edit ${u.name}`}
                className="ml-auto sm:ml-0 flex items-center justify-center w-9 h-9 min-w-[44px] min-h-[44px] rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <Pencil size={14} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            disabled
            className="flex items-center gap-1 text-xs text-slate-400 cursor-not-allowed"
          >
            <ChevronLeft size={14} strokeWidth={1.75} aria-hidden="true" />
            Previous
          </button>
          <p className="text-xs text-slate-400">Page 1</p>
          <button
            type="button"
            disabled
            className="flex items-center gap-1 text-xs text-slate-400 cursor-not-allowed"
          >
            Next
            <ChevronRight size={14} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

function CoursesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {COURSES.length} courses
        </p>
        <button
          type="button"
          disabled
          title="Coming soon"
          className="text-sm font-medium text-slate-400 bg-slate-100 px-4 py-2 rounded-xl cursor-not-allowed min-h-[44px]"
        >
          + New Course
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-50">
        {COURSES.map((c) => (
          <div key={c.id} className="flex items-center gap-4 px-5 py-4">
            {/* Drag handle */}
            <GripVertical size={16} strokeWidth={1.75} className="text-slate-300 shrink-0 cursor-grab" aria-hidden="true" />

            {/* Status dot */}
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${c.published ? 'bg-emerald-400' : 'bg-slate-300'}`}
              aria-label={c.published ? 'Published' : 'Draft'}
              title={c.published ? 'Published' : 'Draft'}
            />

            {/* Title + lesson count */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{c.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{c.lessons} lessons</p>
            </div>

            {/* Published label */}
            <span className={`hidden sm:inline text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${c.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {c.published ? 'Published' : 'Draft'}
            </span>

            {/* Edit button */}
            <button
              type="button"
              disabled
              title="Coming soon"
              className="flex items-center justify-center w-9 h-9 min-h-[44px] min-w-[44px] rounded-xl text-slate-300 cursor-not-allowed"
            >
              <Pencil size={14} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function CommunityTab() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-10 shadow-sm flex flex-col items-center justify-center gap-3 text-center">
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
        <CheckCircle2 size={24} strokeWidth={1.5} className="text-emerald-400" aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-slate-700">No flagged posts</p>
      <p className="text-xs text-slate-400 max-w-xs">
        Reported posts from students will appear here for review.
      </p>
    </div>
  )
}

function StatsTab() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatShimmer label="Total students" />
      <StatShimmer label="Lessons completed this week" />
      <StatShimmer label="AI conversations" />
      <StatShimmer label="New signups" />
    </div>
  )
}

// ── Page root ─────────────────────────────────────────────────────

export default function AdminPage() {
  const [activeTab, setActiveTab]     = useState('Users')
  const [selectedUser, setSelectedUser] = useState(null)

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Admin</h2>
        <p className="text-sm text-slate-500 mt-1.5">Platform management</p>
      </div>

      {/* Tab row */}
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

      {/* Tab panels */}
      {activeTab === 'Users'     && <UsersTab onEdit={setSelectedUser} />}
      {activeTab === 'Courses'   && <CoursesTab />}
      {activeTab === 'Community' && <CommunityTab />}
      {activeTab === 'Stats'     && <StatsTab />}

      {/* Edit drawer */}
      {selectedUser && (
        <EditDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  )
}
