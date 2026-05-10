# Alan Studio — Feature TODO

## Phase 0 · UI Scaffolding

These are visual-only tasks. The goal is to replace empty placeholder pages with
realistic-looking shells that feel intentional, not unfinished. Each placeholder
section gets actual layout structure plus a "Coming Soon" badge where the live
feature isn't ready.

### 0.1 Dashboard
- [ ] Replace `—` stat values with skeleton shimmer loaders (animate-pulse bars)
- [ ] Add a "streak" stat card: flame icon, number, "day streak" label
- [ ] Add a hero "resume" banner — large card with the in-progress lesson title, a
      progress bar (visual only, static for now), and a "Continue" button
- [ ] Add a "Recent activity" section: list of 3–4 placeholder rows (icon + label +
      relative time) with skeleton shimmer while loading

### 0.2 Lessons
- [ ] Replace the blank card with a proper course-catalog shell:
  - Section header "Your courses" with a course-count badge
  - 3–4 mock course cards each with: cover gradient, title, "X of Y lessons",
    progress bar, and a "Coming Soon" pill badge overlaid on locked cards
  - A "New" badge on one card for visual variety
- [ ] Add a tab row: "All · In Progress · Completed" (static, no filtering yet)
- [ ] Sidebar or top filter chips: topics or difficulty (static)

### 0.3 Community
- [ ] Replace the blank card with a feed shell:
  - Compose box at the top (disabled input, "Coming Soon" tooltip on focus)
  - 3–4 mock post cards: avatar initial, name, relative timestamp, body text,
    like/comment counts — all hardcoded
  - A "Members online" sidebar chip (static number)
- [ ] "Coming Soon" banner across the compose box and post interactions

### 0.4 AI Coach
- [ ] Replace the blank card with a chat-UI shell:
  - Message thread area with 2–3 hardcoded example exchanges (user bubble +
    Alan AI bubble) to show the conversation pattern
  - Disabled input bar at the bottom with placeholder "Ask Alan AI…"
  - "Coming Soon" pill badge in the top-right of the chat window
  - Suggested-prompt chips below the input (disabled): e.g. "Review my last
    session", "Give me a drill", "What should I work on today?"

### 0.5 Messages
- [ ] Add `/messages` to sidebar nav with a hardcoded unread badge (`3`) to show
      the pattern
- [ ] Shell layout: two-panel side-by-side on desktop, single-panel (list) on mobile
  - Left rail: 3–4 hardcoded conversation rows — avatar initial, name, last
    message preview (truncated), relative timestamp, unread dot on one row
  - Right panel: "Select a conversation to start reading" empty state with a
    faded envelope icon
- [ ] "New Message" button in the rail header — disabled, "Coming Soon" tooltip
- [ ] "Coming Soon" banner pinned above the conversation list

### 0.6 Admin Panel
- [ ] Add `/admin` route — only renders for `is_owner` or `is_admin`; all other
      users are silently redirected to `/dashboard`
- [ ] Sidebar: admin link appears at the bottom of the nav (above Settings) only
      when the current user has an admin or owner role; shield icon; no "Coming
      Soon" badge (it either shows or it doesn't)
- [ ] `/admin` shell — horizontal sub-nav tabs: Users · Courses · Community · Stats
- [ ] **Users tab** — searchable table shell:
  - Hardcoded 4–5 rows: avatar initial, full name, email, role badges (Student /
    Coach / Admin chips), joined date, a "Edit" icon button
  - Search input at the top (static, no filtering yet)
  - Pagination row at the bottom (Previous / 1 / Next — disabled)
- [ ] **Users · Edit drawer** — slide-in panel (or modal) with placeholder fields:
  display name, email (read-only), role toggle switches (`is_coach`, `is_admin`),
  DM permission toggle (`dm_enabled`); all controls disabled with "Coming Soon"
  tooltip; "Save" button present but inert
- [ ] **Courses tab** — placeholder list:
  - 2–3 hardcoded course rows: title, lesson count, "Published" green dot or
    "Draft" grey dot, a drag-handle icon, an "Edit" icon button
  - "New Course" button — disabled, "Coming Soon" tooltip
- [ ] **Community tab** — placeholder moderation queue:
  - Empty state card: "No flagged posts" with a checkmark icon
  - Note below: "Reported posts from students will appear here"
- [ ] **Stats tab** — platform metric cards shell:
  - 4 cards: Total Students, Lessons Completed This Week, AI Conversations,
    New Signups — all showing `—` with the same shimmer skeleton pattern as the
    Dashboard stats

### 0.7 Sidebar & Global Chrome
- [ ] Add "Coming Soon" dot badges next to Lessons, Community, AI Coach, and
      Messages in the sidebar nav — remove each dot as the feature ships
- [ ] Show the user's avatar image (from Settings → Profile upload) in the sidebar
      user strip when one exists; fall back to initials when not set
- [ ] Mobile bottom tab bar — fixed to the bottom of the screen on viewports below
      1024 px; tabs: Dashboard, Lessons, AI Coach, Community, Messages; active tab
      highlighted; replaces the hamburger slide-in on mobile (slide-in remains for
      Settings and Admin access)
- [ ] Notification bell icon in the sidebar footer (above the user strip) —
      hardcoded red dot badge; opens an empty "No notifications yet" dropdown panel;
      "Coming Soon" label inside the panel

---

## Phase 1 · Dashboard — Make It Live

**Goal:** Real data, real feel. No more dashes.

- [ ] **Supabase schema** — create a `user_stats` view (or computed columns) that
      exposes: `lessons_completed`, `practice_sessions`, `ai_conversations`,
      `community_posts`
- [ ] **Stats hook** — `useUserStats()` — fetches from Supabase on mount, caches
      in context, exposes loading state for skeleton UI
- [ ] **Wire stat cards** — replace `—` with live values from the hook; keep shimmer
      while loading
- [ ] **Activity streak** — create `streaks` table or derive from `session_log`;
      calculate current streak on the server or in a Supabase function; show flame
      icon + day count
- [ ] **Recent activity feed** — create `activity_feed` table (or view joining
      lessons, sessions, posts); fetch last 5 events per user; render with real
      timestamps via `date-fns` or `Intl.RelativeTimeFormat`
- [ ] **Resume banner** — fetch the user's most recent in-progress lesson from
      Supabase; show lesson title + module name + completion percentage; link to
      `/lessons/:id`

---

## Phase 2 · Lessons — Full Curriculum

**Goal:** Structured courses students can browse, unlock, and complete.

### Database
- [ ] `courses` table — id, title, description, cover_url, order, published
- [ ] `modules` table — id, course_id, title, order
- [ ] `lessons` table — id, module_id, title, video_url, duration_seconds, order,
      free_preview (bool)
- [ ] `lesson_progress` table — user_id, lesson_id, completed_at, watch_seconds
- [ ] RLS: students read published courses/modules/lessons; admins + owner write all
- [ ] Supabase seed script with sample course data

### API / Data Layer
- [ ] `useCourses()` hook — fetch all published courses with user progress joined
- [ ] `useCourse(id)` hook — fetch single course with modules + lessons + user
      progress per lesson
- [ ] `markLessonComplete(lessonId)` — upsert to `lesson_progress`
- [ ] Progress percentage helper — `completedLessons / totalLessons`

### UI
- [ ] `/lessons` — course catalog: grid of course cards, progress bars, filter tabs
      (All / In Progress / Completed)
- [ ] `/lessons/:courseId` — course detail: module accordion, lesson list with
      checkmarks for completed, locked icon for gated lessons, "Continue" CTA
- [ ] `/lessons/:courseId/:lessonId` — lesson viewer:
  - Embedded video player (YouTube iframe or HTML5 `<video>`)
  - Lesson title + module breadcrumb
  - "Mark as complete" button → updates `lesson_progress` and advances to next
  - Prev / Next lesson navigation
  - Collapsible notes/transcript panel
- [ ] Progress bar in the sidebar or dashboard resume banner updates in real time

---

## Phase 3 · AI Coach — Conversational Practice

**Goal:** Claude-powered chat that feels like a real coaching session.

### Backend / Edge Functions
- [ ] Supabase Edge Function `ai-coach-chat` — receives `{ messages, userId }`,
      calls Anthropic API (Claude claude-sonnet-4-6), streams the response back
- [ ] System prompt — define Alan's coaching persona, context window includes user
      profile + recent activity summary
- [ ] `ai_conversations` table — id, user_id, created_at, title (auto-generated)
- [ ] `ai_messages` table — id, conversation_id, role (user|assistant), content,
      created_at
- [ ] Persist each message after send/receive
- [ ] Optional: Supabase Edge Function `summarize-conversation` — generates a short
      title from the first exchange (for conversation history list)

### UI
- [ ] `/ai-coach` — landing: conversation history list in a left rail +
      "New session" button; on first visit show a welcome state with suggested
      prompts
- [ ] Chat thread view — message bubbles (user right, AI left), streaming token
      display, scroll-to-bottom on new message
- [ ] Input bar — textarea (Enter to send, Shift+Enter for newline), send button,
      loading spinner while streaming
- [ ] Suggested prompt chips — "Review my progress", "Give me a drill", "What
      should I focus on?", "Help me with [topic]"
- [ ] Error state — if API call fails, show retry button inline in the thread
- [ ] Conversation title shown in header; click to rename
- [ ] Delete conversation (with confirmation)

---

## Phase 4 · Community — Student Hub

**Goal:** A simple, moderated space for students to connect.

### Database
- [ ] `posts` table — id, user_id, body, created_at, updated_at, is_pinned,
      is_removed
- [ ] `post_reactions` table — post_id, user_id, emoji (or type enum like 'like')
- [ ] `comments` table — id, post_id, user_id, body, created_at
- [ ] RLS: authenticated users read non-removed posts; users write/delete only their
      own; admins + owner can remove any
- [ ] `community_posts` stat increments via trigger or client-side after post create

### API / Data Layer
- [ ] `useFeed()` hook — paginated fetch of recent posts (20 at a time, cursor-based)
- [ ] `usePost(id)` hook — single post with comments
- [ ] `createPost(body)` — insert + optimistic UI update
- [ ] `deletePost(id)` — soft-delete (set `is_removed = true`)
- [ ] `toggleReaction(postId, emoji)` — upsert/delete from `post_reactions`
- [ ] `createComment(postId, body)`

### UI
- [ ] `/community` — feed with infinite scroll or "Load more" pagination
- [ ] Compose box — textarea + post button; character limit (500); disable while
      submitting
- [ ] Post card — avatar, name, relative time, body, like count + toggle, comment
      count, "…" overflow menu (edit/delete own posts)
- [ ] Comment thread — inline expand below post card; comment list + reply input
- [ ] Online member count chip (can be static or Supabase Realtime presence)
- [ ] Pin indicator for pinned posts (admin-set)
- [ ] Admin controls — "Remove post" action visible to admin/owner roles

---

## Phase 5 · Admin Panel (Owner / Coach Access)

**Goal:** Role-gated management views for Alan and coaches.

- [ ] Route guard — check `profiles.is_owner || profiles.is_admin` before
      rendering; redirect non-admins to `/dashboard`
- [ ] Add `/admin` to router + sidebar (hidden for non-admins)

### Sub-pages
- [ ] `/admin/users` — searchable table of all profiles; columns: name, email,
      role flags, joined date; click row to view profile
- [ ] `/admin/users/:id` — view/edit user profile; toggle `is_coach` / `is_admin`
      flags (owner only for admin flag); toggle `dm_enabled` with confirmation modal;
      assign student to a coaching cohort
- [ ] `/admin/courses` — list of courses with publish/unpublish toggle, reorder
      drag handles, "New course" button
- [ ] `/admin/courses/:id` — course editor: title, description, cover image upload,
      module/lesson CRUD with drag-to-reorder
- [ ] `/admin/community` — flagged/reported posts queue; remove or approve buttons
- [ ] `/admin/stats` — platform-wide stats: total students, lessons completed this
      week, AI conversations this week, new signups

---

## Phase 6 · Polish & Infrastructure

- [ ] **Onboarding flow** — after first signup, a 2-step modal asks: goal (e.g.
      "Improve X skill") and experience level; saves to `profiles.onboarding_data`;
      pre-fills AI Coach system prompt context
- [ ] **Email notifications** — Supabase email triggers for: welcome on signup,
      weekly progress summary (via scheduled Edge Function)
- [ ] **PWA offline mode** — cache course catalog and last-viewed lesson for offline
      reading (service worker via vite-plugin-pwa config)
- [ ] **Toast system** — global `<ToastProvider>` with `useToast()` hook; replace
      per-card banners in Settings; use for all async feedback app-wide
- [ ] **Error boundary** — wrap route-level pages in a `<ErrorBoundary>` with a
      friendly fallback and "Reload" button
- [ ] **Loading skeleton components** — create reusable `<Skeleton>` component
      (animate-pulse rectangles) used consistently across all data-loading states
- [ ] **Route-level code splitting** — `React.lazy()` + `<Suspense>` on each page
      component to keep initial bundle small
- [ ] **Accessibility audit** — keyboard nav through sidebar, focus traps in
      modals, `aria-live` regions for async status messages
- [ ] **Mobile bottom nav** — on small screens, replace the slide-in sidebar with
      a fixed bottom tab bar (Dashboard, Lessons, AI Coach, Community) for
      thumb-friendly navigation

---

## Phase 7 · Direct Messaging

**Goal:** Private 1:1 messaging between students, gated by an explicit permission
flag that only admin and owner can grant. No student can DM by default.

### Permission Model
- [ ] Add `dm_enabled boolean default false` to the `profiles` table
- [ ] RLS rule: a user can only initiate or receive DMs if their `dm_enabled` flag
      is `true`; no exceptions — even if both parties are students the flag must be
      set on both sides
- [ ] Admin/owner toggle — expose the flag in `/admin/users/:id` with a clear label
      ("Allow direct messaging") and a confirmation step before enabling
- [ ] Owner can grant DM permission to coaches independently of the student flag
- [ ] Audit log — record who enabled DM for whom and when (`dm_permission_log`
      table: granter_id, grantee_id, granted_at, revoked_at)

### Database
- [ ] `dm_conversations` — id, created_at, last_message_at
- [ ] `dm_participants` — conversation_id, user_id, unread_count (updated by
      trigger); composite PK on (conversation_id, user_id)
- [ ] `dm_messages` — id, conversation_id, sender_id, body, created_at, read_at
      (nullable)
- [ ] RLS: only participants of a conversation can read its messages; only the
      sender can insert; admin/owner can read any conversation for moderation
- [ ] Trigger: on new `dm_messages` insert, update `dm_conversations.last_message_at`
      and increment recipient's `unread_count` in `dm_participants`
- [ ] Trigger: mark `dm_messages.read_at` when the recipient views the thread;
      reset their `unread_count` to 0

### API / Data Layer
- [ ] `useConversations()` — fetch user's conversations ordered by
      `last_message_at` desc, joined with participant profiles
- [ ] `useMessages(conversationId)` — paginated fetch, subscribe to Supabase
      Realtime for new messages
- [ ] `startConversation(recipientId)` — check both parties have `dm_enabled`;
      create conversation + two participant rows; return conversationId
- [ ] `sendMessage(conversationId, body)` — insert + optimistic UI
- [ ] `markRead(conversationId)` — update read_at and reset unread_count

### UI
- [ ] Add `/messages` to router and sidebar nav (with unread count badge that
      updates in real time via Supabase Realtime)
- [ ] `/messages` — two-panel layout:
  - Left rail: conversation list — avatar, name, last message preview (truncated),
    relative timestamp, unread dot
  - Right panel: message thread — bubbles (sent right / received left), sender
    name + avatar above each group, relative timestamps
  - Empty state when no conversations: "No messages yet"
- [ ] "New Message" button — opens a modal with a searchable user list (only
      `dm_enabled` users shown); selecting one starts or opens the conversation
- [ ] Input bar — textarea, send on Enter, Shift+Enter for newline, character limit
      (2000), disable while sending
- [ ] Real-time delivery — new messages appear instantly without a page refresh
- [ ] Unread badge on the `/messages` nav item; clears when thread is opened
- [ ] Message timestamps show on hover

### Admin / Moderation
- [ ] `/admin/messages` — search interface: look up conversations by participant
      name; read-only view of any thread for moderation purposes
- [ ] "Disable DM" action from the moderation view — flips the flag off and
      shows an in-app notice to the affected user
- [ ] Flag/report button on messages (student-facing) → creates a row in an
      `dm_reports` table for admin review

---

## Phase 8 · Media Hub — Video & Audio Upload with AI Analysis

**Goal:** The analytical engine of the platform. Students upload recordings of
speeches, presentations, or practice sessions and receive deep AI-powered
feedback. This is the core differentiator — treat it as the product's heartbeat.

### Integration Strategy (in order)

**Tier 1 — Yoodli (ship first)**
Yoodli provides the richest out-of-the-box speech analysis: pacing, filler words,
eye contact, facial expression confidence, body language, tone, and energy. Check
for developer/enterprise API access at yoodli.ai before building any custom
analysis. If a REST API or webhook pipeline is available, integrate it as the
primary analysis provider for both video and audio submissions. Store the raw
Yoodli JSON response in `media_analysis.analysis_json` so every field is
available for display without re-processing.

**Tier 2 — Deepgram / OpenAI Whisper (transcription fallback)**
If Yoodli API is not yet available or is unavailable for a given file type, use
Deepgram (real-time streaming, speaker diarization, word-level timestamps) or
OpenAI Whisper (batch, highest accuracy) for transcription only. Pair with
Claude to generate coaching feedback from the transcript text.

**Tier 3 — Custom Claude pipeline (future)**
Once Tier 1/2 are running, add a Supabase Edge Function that sends the transcript
+ Yoodli metrics JSON to Claude claude-sonnet-4-6 with a coaching persona system
prompt. Claude writes a personalized paragraph of feedback that synthesises all
signals into actionable coaching language.

### Database
- [ ] `media_submissions` — id, user_id, type (`video` | `audio`), storage_path,
      file_size_bytes, duration_seconds, title, context_note (student's description
      of what they were practicing), submitted_at, status
      (`pending` | `processing` | `ready` | `failed`)
- [ ] `media_transcripts` — id, submission_id, full_text, word_timestamps_json
      (array of `{ word, start_ms, end_ms }`), provider, created_at
- [ ] `media_analysis` — id, submission_id, provider (`yoodli` | `deepgram` |
      `whisper` | `claude`), analysis_json (JSONB), coaching_summary (text,
      Claude-generated), created_at
- [ ] RLS: students read/write only their own submissions; coaches and admins read
      all; owner reads all; no student reads another student's submission
- [ ] Supabase Storage bucket `media` — max 500 MB video, 50 MB audio; accepted
      types: video/mp4, video/webm, video/mov, audio/mp3, audio/wav, audio/m4a,
      audio/ogg; path: `{user_id}/{submission_id}.{ext}`

### Backend / Edge Functions
- [ ] `process-media` Edge Function — triggered by a Supabase Storage webhook on
      new upload; orchestrates:
  1. Update `media_submissions.status` to `processing`
  2. Call Yoodli API with the media URL (or upload); await result
  3. If Yoodli unavailable, fall back to Deepgram/Whisper for transcript
  4. Insert rows into `media_transcripts` and `media_analysis`
  5. Call Claude with transcript + metrics to generate `coaching_summary`
  6. Update `media_submissions.status` to `ready` (or `failed` with error)
  7. Send Supabase Realtime event so the UI updates without polling
- [ ] `get-analysis-report` Edge Function — formats raw `analysis_json` into a
      normalised report shape regardless of which provider produced it; allows
      the UI to stay provider-agnostic
- [ ] Yoodli API client module — encapsulates auth, upload, polling/webhook, and
      response normalisation; swap provider without touching the Edge Function
      orchestrator

### UI — Upload Flow
- [ ] Add `/practice` to router and sidebar nav (replace or sub-section of AI Coach)
- [ ] `/practice` — two tabs at top: "Upload" and "My Submissions"
- [ ] Upload tab:
  - Drag-and-drop zone with video/audio file type icons; click to browse
  - File type + size validation before upload begins (show friendly error if
    exceeded)
  - Title field (required) + "What were you practicing?" textarea (optional
    context sent to AI)
  - Duration preview after file is selected (HTML5 media element metadata)
  - Chunked upload progress bar (Supabase resumable upload API for large files)
  - After submit: card switches to "Processing…" state with animated spinner;
    Supabase Realtime updates the card to "Ready" when analysis completes

### UI — Submissions List
- [ ] `/practice` (My Submissions tab) — chronological list of cards:
  - Thumbnail (video poster frame or audio waveform placeholder icon)
  - Title, type badge (Video / Audio), duration, submission date
  - Status badge: Processing (spinner) / Ready (green) / Failed (red + retry)
  - Click → analysis report

### UI — Analysis Report
- [ ] `/practice/:submissionId` — full-width report page:
  - **Header** — title, date, duration, type; "Share with Coach" button (sends
    a notification to the assigned coach)
  - **Transcript panel** — scrollable, word-level timestamps highlighted as audio
    plays; filler words highlighted in amber; if video, panel syncs to playhead
  - **Metrics dashboard** (visible for both audio and video):
    - Pacing gauge — words per minute vs. ideal range (120–160 wpm)
    - Filler word counter — total count + breakdown list ("um: 12, uh: 5, like: 8")
    - Energy/tone graph — line chart over time (high / medium / low)
    - Conciseness score (percentage of filler-free sentences)
  - **Video-only metrics**:
    - Eye contact percentage — donut chart
    - Facial expression confidence score + brief timeline
    - Body language summary (posture, hand gesture frequency)
  - **Coaching summary** — Claude-generated paragraph in a styled card; quoted
    coaching language, not dry metrics
  - **Replay panel** — video/audio player synchronized with the transcript;
    coach can add timestamped comments (stored in `media_comments` table)
  - Coach view: all of the above plus a "Write feedback" textarea that saves
    to `media_analysis.coach_note`

### Admin
- [ ] `/admin/practice` — all submissions across all students; filter by user,
      date, type, status
- [ ] Coach dashboard section — "Submissions awaiting review" queue: submissions
      where `coach_note` is null, sorted by submission date

---

## Phase 9 · Live Video Coaching — Sessions with Real-Time AI Analysis

**Goal:** The classroom. Coach-hosted group video sessions where students can
practice live, receive real-time AI feedback visible to the whole class, and
leave with a full transcript and per-presenter analysis report.

### Infrastructure

**Recommended stack:** Daily.co for video/audio transport and built-in
transcription webhooks, paired with Deepgram streaming for word-level real-time
transcription when a student is in Presentation Mode. Daily.co handles the
WebRTC complexity and has a JavaScript SDK that works cleanly in React.

Later: swap the transport layer for LiveKit (self-hosted) once the AI pipeline
is proven, to reduce third-party costs at scale.

### Session Types
1. **1:1 Coaching** — coach + one student; private room; always records
2. **Group Session (Class)** — coach + cohort; broadcast mode (students muted
   by default); Presentation Mode available; records and stores per-presenter
   analysis

### Database
- [ ] `coaching_sessions` — id, host_id (coach/owner), title, session_type
      (`one_on_one` | `group`), daily_room_name, daily_room_url, scheduled_at,
      started_at, ended_at, recording_url, is_cancelled
- [ ] `session_invites` — session_id, user_id, invited_at, accepted_at (student
      RSVP)
- [ ] `session_participants` — session_id, user_id, joined_at, left_at, daily_participant_id
- [ ] `hand_queue` — session_id, user_id, raised_at, granted_at, dismissed_at;
      represents the mic/presentation request queue
- [ ] `session_presentations` — id, session_id, presenter_id, started_at,
      ended_at, transcript (text), analysis_json (JSONB), coaching_summary (text),
      feedback_shared_with_class (bool)
- [ ] `session_chat_messages` — id, session_id, user_id, body, created_at (in-room
      text chat)
- [ ] RLS: session participants read the session they joined; coach reads and
      writes everything in their sessions; owner reads all

### Backend / Edge Functions
- [ ] `create-daily-room` Edge Function — called when coach creates a session;
      calls Daily.co REST API to provision a private room with recording enabled;
      stores room name + URL in `coaching_sessions`; sends invite notifications
      to invited users
- [ ] `end-daily-room` Edge Function — called when coach ends session; calls
      Daily.co to close the room; fetches recording URL; triggers
      `process-session-recording` asynchronously
- [ ] `process-session-recording` Edge Function — after session ends:
  1. Download or reference the Daily.co recording
  2. For each presenter in `session_presentations`, extract their audio segment
  3. Send to Yoodli or Deepgram for full analysis
  4. Generate Claude coaching summary per presenter
  5. Update `session_presentations` with all results
  6. Mark session as `ready` so the recap page activates
- [ ] `presentation-realtime-hook` Edge Function (or Deepgram streaming client
      in the browser) — while a student is in Presentation Mode, stream audio to
      Deepgram; push partial transcripts + rolling metrics to Supabase Realtime
      channel `session:{id}:presenter:{userId}`; coach UI subscribes and shows
      live metrics sidebar
- [ ] Daily.co webhook handler — receives transcription events and recording-ready
      events; routes to appropriate processing functions

### UI — Session Management
- [ ] Add `/sessions` to router and sidebar nav
- [ ] `/sessions` — upcoming sessions list (cards with title, date/time, type,
      participant count, "Join" or "View recap" CTA) + past sessions below
- [ ] `/sessions/new` — coach/admin only; form: title, type selector, date/time
      picker, invite students (searchable multi-select from user list), optional
      description; submits → creates Daily.co room + DB row + sends invites
- [ ] Student invite notification — in-app notification + email (Supabase email
      trigger) with session title, time, and "Accept" link
- [ ] `/sessions/:id` (pre-join) — session detail: title, host, participants,
      countdown timer, "Join session" button (active 5 min before scheduled time)

### UI — Live Room (`/sessions/:id/live`)
- [ ] **Video grid** — Daily.co Prebuilt or custom using `@daily-co/daily-js`:
  - Coach tile always pinned top-left or full-width in spotlight
  - Student tiles in a responsive grid (up to ~16 visible at once)
  - Muted indicator overlays on each tile
- [ ] **Sidebar (togglable on mobile)**:
  - Participants list — name, mic/camera status, hand-raised indicator
  - Hand queue section (coach-visible only) — ordered list of raised hands with
    "Grant mic" and "Dismiss" buttons
  - Session chat — messages appear in real time via Supabase Realtime
- [ ] **Coach controls bar** (bottom, coach-only):
  - Mute all / unmute all toggle
  - Record toggle (shows red dot + elapsed time when recording)
  - End session button (with confirmation)
  - Spotlight a participant
- [ ] **Student controls bar** (bottom, student-only):
  - Raise hand button — inserts into `hand_queue`; button state changes to
    "Waiting…" with cancel option; pulses when hand is raised
  - Camera on/off (own camera only)
  - Leave session
- [ ] **Presentation Mode** (activates when coach grants mic to a student):
  - Student's tile expands to spotlight / full-width for the class
  - Student sees: "You're presenting — the AI is listening" banner + their own
    live metrics panel (pacing indicator, filler word counter, eye contact dot)
  - Class sees: the presenter's video spotlighted; a subtle "AI Feedback" panel
    slides in at the bottom of the presenter's tile showing live pacing bar +
    filler word count
  - Coach sees: full live metrics sidebar — pacing gauge, filler words, tone
    line (updating every ~5 s), rolling transcript stream
  - When coach ends presentation: AI feedback card posts to the session chat
    visible to the whole class — overall score, top 3 observations, one coaching
    tip; framed as encouragement not criticism
- [ ] **Class feedback card** — styled card in the session chat feed:
  - Presenter name + "just finished presenting"
  - Score badge (e.g. 84 / 100) if Yoodli provides a score
  - 3 bullet observations (e.g. "Great energy throughout", "7 filler words —
    aim for under 5", "Eye contact was strong")
  - One coaching tip in italics
  - "Full report available after session" note

### UI — Session Recap (`/sessions/:id/recap`)
- [ ] Unlocks after `coaching_sessions.ended_at` is set and processing completes
- [ ] Recording player — full session recording with chapter markers per presenter
- [ ] Presenter analysis cards — one expandable card per student who presented:
  - Name, presentation duration, overall score
  - Pacing, filler words, eye contact, tone metrics (same layout as Phase 8
    analysis report)
  - Full transcript with filler words highlighted
  - Claude coaching summary
- [ ] Session chat transcript — full log of chat messages with timestamps
- [ ] Coach's notes — editable textarea (coach/owner only); saves to
      `coaching_sessions.coach_notes`
- [ ] "Download report" — PDF export of a student's own analysis card (browser
      `window.print()` on a styled print layout)

### Admin
- [ ] `/admin/sessions` — all sessions; filter by coach, date range, type;
      columns: title, host, participant count, duration, recording status
- [ ] Coach view — coaches see only sessions they host; same list but scoped
- [ ] Session cancel action — soft-cancel (`is_cancelled = true`) + sends
      cancellation notification to all invited participants
