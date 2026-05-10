import { Heart, MessageSquare, Info } from 'lucide-react'

const POSTS = [
  {
    id: 1,
    initials: 'AM',
    name: 'Alex M.',
    time: '1h ago',
    body: "Just finished my first practice session with the AI Coach! The feedback on my pacing was incredibly helpful. Anyone else notice a big improvement after week 2?",
    likes: 12,
    comments: 4,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    initials: 'SK',
    name: 'Sarah K.',
    time: '3h ago',
    body: "Nervous about my presentation tomorrow. Any tips for managing nerves right before going on stage?",
    likes: 8,
    comments: 6,
    color: 'bg-emerald-500',
  },
  {
    id: 3,
    initials: 'JT',
    name: 'Jordan T.',
    time: 'Yesterday',
    body: "Sharing my week 3 progress — filler words down from 24 per minute to 9! Consistency is everything. Keep going everyone.",
    likes: 31,
    comments: 11,
    color: 'bg-violet-500',
  },
  {
    id: 4,
    initials: 'MR',
    name: 'Maya R.',
    time: '2 days ago',
    body: "Mirror vs. recording yourself — which do you prioritize for practice? Both feel useful but I'm not sure where to put my energy.",
    likes: 5,
    comments: 3,
    color: 'bg-amber-500',
  },
]

function PostCard({ post }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3.5 mb-4">
        <div className={`w-9 h-9 rounded-full ${post.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
          {post.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 leading-none">{post.name}</p>
          <p className="text-xs text-slate-400 mt-1">{post.time}</p>
        </div>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">{post.body}</p>
      {/* Interaction row — min-h-[44px] keeps touch targets reachable */}
      <div className="flex items-center gap-5 mt-4 pt-4 border-t border-slate-50">
        <button
          type="button"
          disabled
          title="Coming soon"
          className="flex items-center gap-2 text-xs text-slate-400 cursor-not-allowed min-h-[44px] pr-2"
        >
          <Heart size={14} strokeWidth={1.75} aria-hidden="true" />
          {post.likes}
        </button>
        <button
          type="button"
          disabled
          title="Coming soon"
          className="flex items-center gap-2 text-xs text-slate-400 cursor-not-allowed min-h-[44px] pr-2"
        >
          <MessageSquare size={14} strokeWidth={1.75} aria-hidden="true" />
          {post.comments}
        </button>
      </div>
    </div>
  )
}

export default function CommunityPage() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Community</h2>
          <p className="text-sm text-slate-500 mt-1.5">Connect with fellow students</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full shrink-0 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" aria-hidden="true" />
          12 online
        </div>
      </div>

      {/* Coming Soon banner */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
        <Info size={16} className="text-amber-500 shrink-0" aria-hidden="true" />
        <p className="text-sm text-amber-700">
          Community is launching soon — posts below are a preview of what&apos;s coming.
        </p>
      </div>

      {/* Compose box */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <textarea
          disabled
          placeholder="Share something with your cohort…"
          title="Coming soon"
          rows={3}
          className="w-full text-sm placeholder-slate-400 resize-none outline-none cursor-not-allowed opacity-50"
        />
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-3">
          <p className="text-xs text-slate-400 italic">Posting opens at launch</p>
          {/* min-h-[44px] touch target */}
          <button
            type="button"
            disabled
            className="text-sm font-medium bg-slate-100 text-slate-400 px-5 py-2.5 rounded-xl cursor-not-allowed min-h-[44px]"
          >
            Post
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
