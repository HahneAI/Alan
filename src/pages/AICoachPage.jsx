import { Sparkles, Send } from 'lucide-react'

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

function AIBubble({ text }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles size={12} strokeWidth={1.75} className="text-violet-600" aria-hidden="true" />
      </div>
      <div className="max-w-[80%] bg-slate-50 border border-slate-100 text-slate-700 text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-tl-sm">
        {text}
      </div>
    </div>
  )
}

function UserBubble({ text }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] bg-slate-900 text-white text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-tr-sm">
        {text}
      </div>
    </div>
  )
}

export default function AICoachPage() {
  return (
    <div className="max-w-4xl space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">AI Coach</h2>
        <p className="text-sm text-slate-500 mt-1">Practice with Alan&apos;s AI</p>
      </div>

      {/* Chat window */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm flex flex-col overflow-hidden">

        {/* Chat header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
              <Sparkles size={14} strokeWidth={1.75} className="text-violet-600" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-slate-900">Alan AI</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wide bg-violet-100 text-violet-600 px-2.5 py-1 rounded-full">
            Coming Soon
          </span>
        </div>

        {/* Message thread */}
        <div className="flex flex-col gap-4 p-4 h-96 overflow-y-auto">
          {MESSAGES.map((msg, i) =>
            msg.role === 'user'
              ? <UserBubble key={i} text={msg.text} />
              : <AIBubble key={i} text={msg.text} />
          )}
        </div>

        {/* Suggested prompts */}
        <div className="px-4 py-3 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Suggested</p>
          <div className="flex flex-wrap gap-2">
            {PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled
                title="Coming soon"
                className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full cursor-not-allowed"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <div className="flex items-end gap-2 px-4 py-3 border-t border-slate-100">
          <textarea
            disabled
            placeholder="Ask Alan AI…"
            title="Coming soon"
            rows={1}
            className="flex-1 text-sm placeholder-slate-400 resize-none outline-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 cursor-not-allowed opacity-60"
          />
          <button
            type="button"
            disabled
            className="w-9 h-9 flex items-center justify-center bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed shrink-0"
          >
            <Send size={15} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
