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

### 0.5 Sidebar & Global Chrome
- [ ] Add a small "Coming Soon" dot/badge next to Lessons, Community, and AI Coach
      nav links in the Sidebar — remove each as the feature goes live
- [ ] Show the user's avatar image (if set) in the sidebar user strip instead of
      always rendering initials

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
      flags (owner only for admin flag)
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
