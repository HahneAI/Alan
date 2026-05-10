import { MailOpen, PenSquare } from 'lucide-react'
import { Info } from 'lucide-react'

const CONVERSATIONS = [
  {
    id: 1,
    initials: 'SK',
    name: 'Sarah K.',
    preview: "That feedback on your pacing was really eye-opening, thank you!",
    time: '2m ago',
    color: 'bg-emerald-500',
    unread: true,
  },
  {
    id: 2,
    initials: 'CA',
    name: 'Coach Alan',
    preview: "Great session today! Your eye contact is improving every week.",
    time: '1h ago',
    color: 'bg-slate-700',
    unread: false,
  },
  {
    id: 3,
    initials: 'JT',
    name: 'Jordan T.',
    preview: "Did you get a chance to review the notes from Tuesday's class?",
    time: 'Yesterday',
    color: 'bg-violet-500',
    unread: false,
  },
  {
    id: 4,
    initials: 'MR',
    name: 'Maya R.',
    preview: "Thanks for the tip about the 3-second rule — it's already helping.",
    time: '2d ago',
    color: 'bg-amber-500',
    unread: false,
  },
]

export default function MessagesPage() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Messages</h2>
        <p className="text-sm text-slate-500 mt-1.5">Direct messages with your cohort</p>
      </div>

      {/* Two-panel card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex h-[580px]">

        {/* Left rail — full width on mobile, fixed width on desktop */}
        <div className="flex flex-col w-full sm:w-72 md:w-80 shrink-0 border-r border-slate-100">

          {/* Rail header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900">Direct Messages</p>
            <button
              type="button"
              disabled
              title="Coming soon"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg cursor-not-allowed"
            >
              <PenSquare size={12} strokeWidth={1.75} aria-hidden="true" />
              New
            </button>
          </div>

          {/* Coming Soon banner */}
          <div className="flex items-center gap-2.5 bg-amber-50 border-b border-amber-100 px-4 py-3">
            <Info size={13} className="text-amber-500 shrink-0" aria-hidden="true" />
            <p className="text-xs text-amber-700">Messaging is launching soon.</p>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {CONVERSATIONS.map((convo) => (
              <div
                key={convo.id}
                className="flex items-start gap-3 px-5 py-4 opacity-75 cursor-not-allowed select-none"
                title="Coming soon"
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full ${convo.color} flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5`}>
                  {convo.initials}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className={`text-sm leading-none ${convo.unread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {convo.name}
                    </p>
                    <p className="text-[11px] text-slate-400 shrink-0">{convo.time}</p>
                  </div>
                  <p className="text-xs text-slate-500 truncate leading-relaxed">{convo.preview}</p>
                </div>

                {/* Unread dot */}
                {convo.unread && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" aria-label="Unread" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — hidden on mobile */}
        <div className="hidden sm:flex flex-1 flex-col items-center justify-center gap-3 text-center px-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
            <MailOpen size={26} strokeWidth={1.25} className="text-slate-300" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">No conversation selected</p>
            <p className="text-xs text-slate-300 mt-1">Choose a message from the list to read it here</p>
          </div>
        </div>

      </div>
    </div>
  )
}
