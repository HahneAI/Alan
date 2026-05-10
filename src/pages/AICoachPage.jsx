import { Sparkles, Send, Mic, BarChart2, Repeat2 } from 'lucide-react'

const MESSAGES = [
  {
    role: 'user',
    text: 'How can I improve my eye contact during presentations?',
  },
  {
    role: 'assistant',
    text: "Great question — eye contact is one of your most powerful tools on stage. Try the 3-second rule: hold contact with one person for about 3 seconds before shifting to the next. Mentally divide your audience into left, center, and right zones and rotate through them. Early on, find two or three people who are nodding — use them as anchors when nerves kick in.",
  },
  {
    role: 'user',
    text: 'What about when my mind goes blank mid-speech?',
  },
  {
    role: 'assistant',
    text: "That happens to everyone — even seasoned pros. The fix is having a recovery move ready before you need it. Take one slow breath, briefly glance at your last phrase, and restate it slightly differently. This buys you 10–15 natural seconds. Strong section transitions also help: a confident 'So, moving on to…' carries you forward while your brain catches up.",
  },
]

const PROMPTS = ['Review my last session', 'Give me a drill', 'What should I work on?', 'Help me with nerves']

const CAPABILITIES = [
  {
    icon: Mic,
    title: 'Live practice sessions',
    description: 'Speak freely and get instant feedback on pacing, filler words, and tone.',
  },
  {
    icon: BarChart2,
    title: 'Progress analysis',
    description: 'Alan AI tracks your trends across sessions and highlights what's improving.',
  },
  {
    icon: Repeat2,
    title: 'Technique drills',
    description: 'Targeted exercises for eye contact, pausing, vocal variety, and more.',
  },
]

function AIBubble({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles size={13} strokeWidth={1.75} className="text-violet-600" aria-hidden="true" />
      </div>
      <div className="max-w-[80%] bg-slate-50 border border-slate-100 text-slate-700 text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-tl-sm">
        {text}
      </div>
    </div>
  )
}

function UserBubble({ text }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] bg-slate-900 text-white text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-tr-sm">
        {text}
      </div>
    </div>
  )
}

export default function AICoachPage() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">AI Coach</h2>
        <p className="text-sm text-slate-500 mt-1.5">Practice with Alan&apos;s AI</p>
      </div>

      {/* Chat window */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">

        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
              <Sparkles size={15} strokeWidth={1.75} className="text-violet-600" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-slate-900">Alan AI</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wide bg-violet-100 text-violet-600 px-2.5 py-1 rounded-full">
            Coming Soon
          </span>
        </div>

        {/*
          Message thread — h-56 keeps the scroll zone compact so the user's
          thumb can reach the page scroll outside the card. overscroll-behavior-y
          contains momentum so the thread's boundary doesn't fight the page scroll.
        */}
        <div
          className="flex flex-col gap-5 p-5 h-56 overflow-y-auto"
          style={{ overscrollBehaviorY: 'contain' }}
        >
          {MESSAGES.map((msg, i) =>
            msg.role === 'user'
              ? <UserBubble key={i} text={msg.text} />
              : <AIBubble key={i} text={msg.text} />
          )}
        </div>

        {/* Suggested prompts */}
        <div className="px-5 py-4 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Suggested</p>
          <div className="flex flex-wrap gap-2">
            {PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled
                title="Coming soon"
                className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-full cursor-not-allowed"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <div className="flex items-end gap-3 px-5 py-4 border-t border-slate-100">
          <textarea
            disabled
            placeholder="Ask Alan AI…"
            title="Coming soon"
            rows={1}
            className="flex-1 text-sm placeholder-slate-400 resize-none outline-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 cursor-not-allowed opacity-60"
          />
          <button
            type="button"
            disabled
            className="w-11 h-11 flex items-center justify-center bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed shrink-0"
          >
            <Send size={16} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Capabilities — gives the page scrollable length below the chat and
          shows what Alan AI will do when it ships. */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">What Alan AI can do</p>
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm divide-y divide-slate-100">
          {CAPABILITIES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-4 px-5 py-4">
              <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={16} strokeWidth={1.75} className="text-violet-500" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
