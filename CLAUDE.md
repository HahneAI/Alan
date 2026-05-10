# Alan Studio — CLAUDE.md

## Tech Stack

- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"` in index.css)
- **Routing:** React Router v7
- **Backend / Auth / Storage:** Supabase
- **Icons:** Lucide React
- **Deployment:** Vercel

---

## UI Design System

### Spacing Philosophy

The app uses a **breathable, modern spacing system**. The goal is generous white
space that makes content feel unhurried and premium — not cramped. When in doubt,
add more space, not less.

| Token | Value | Usage |
|---|---|---|
| Section gap | `space-y-8` to `space-y-10` | Between major page sections |
| Card padding | `p-5` or `p-6` | Inside white cards |
| Card inner gap | `space-y-4` to `space-y-5` | Between fields/rows inside a card |
| Grid gap | `gap-4` to `gap-5` | Between grid items (stat cards, course cards) |
| List row padding | `px-5 py-4` | Rows inside divided lists (activity feed, etc.) |
| Section label margin | `mb-4` | Below `text-xs uppercase tracking-wider` labels |

### Cards

All surface cards use this base pattern:

```jsx
<div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
```

- **Always `rounded-2xl`** — not `rounded-xl`. The larger radius reads as more
  modern and intentional.
- **Always `shadow-sm`** — subtle lift, never heavy shadows.
- **Always `border border-slate-100`** — defines the card boundary on the white
  page background.
- Card headers (title rows) use `px-6 py-5 border-b border-slate-100`.
- Card footers (save rows) use `px-6 py-5 bg-slate-50 border-t border-slate-100`.

### Typography

| Role | Classes |
|---|---|
| Page title | `text-2xl font-bold tracking-tight text-slate-900` |
| Page subtitle | `text-sm text-slate-500 mt-1.5` |
| Section label | `text-xs font-semibold text-slate-400 uppercase tracking-wider` |
| Card section title | `text-sm font-semibold text-slate-900` |
| Body text | `text-sm text-slate-700 leading-relaxed` |
| Meta / timestamps | `text-xs text-slate-400` |
| Tiny badges / pills | `text-[10px] font-bold uppercase tracking-wide` |

Never add comments explaining what text does. Names and context make it obvious.

### Color Palette

All UI is built on the **slate** scale. Accent colors are used sparingly for
meaning only:

| Color | Usage |
|---|---|
| `slate-900` | Primary text, active states, CTA buttons |
| `slate-500 / 400` | Secondary text, placeholders |
| `slate-100 / 50` | Borders, dividers, subtle backgrounds |
| `amber-*` | Streak / streak-related, coming-soon info banners |
| `blue-*` | Lessons / progress |
| `emerald-*` | Success states, community online indicator |
| `violet-*` | AI Coach feature |

### Interactive Elements

- **Primary buttons:** `bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-700`
- **Secondary / ghost buttons:** `bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl`
- **Nav links (active):** `bg-white/10 text-white`
- **Nav links (inactive):** `text-slate-400 hover:text-white hover:bg-white/5`
- **Disabled state:** `cursor-not-allowed opacity-50` (or `opacity-60` for inputs)

---

## Mobile & Safe-Area System

### viewport-fit=cover

`index.html` declares `viewport-fit=cover` and
`apple-mobile-web-app-status-bar-style: black-translucent`. This makes the app
render edge-to-edge on all iPhones including Dynamic Island models (iPhone 14 Pro
through iPhone 17 and beyond). Content fills the full screen; we then push it
away from unsafe regions with CSS environment variables.

### Safe-Area Utility Classes

Defined in `src/index.css` under `@layer utilities`:

```css
.pt-safe  { padding-top:    env(safe-area-inset-top,    0px); }
.pr-safe  { padding-right:  env(safe-area-inset-right,  0px); }
.pb-safe  { padding-bottom: env(safe-area-inset-bottom, 0px); }
.pl-safe  { padding-left:   env(safe-area-inset-left,   0px); }
```

These are no-ops on devices without notches or islands (inset = 0). Use them
anywhere content must not hide behind a device chrome element.

### Where each class is applied

| Location | Class | Why |
|---|---|---|
| `TopBar` `<header>` | `pt-safe` | Pushes content row below the Dynamic Island. The `bg-white` still fills the island region visually. |
| `Sidebar` logo row | `pt-safe` | Same — the island appears over the sidebar on mobile overlay. |
| `Sidebar` user strip | `pb-safe` | Pushes sign-out button above the home indicator bar. |
| `AppLayout` `<main>` | `page-pb-safe` | Responsive class (see below) — adds home indicator clearance to the designed bottom padding. |

### `page-pb-safe` — Responsive Bottom Padding

Written **outside** `@layer` in `index.css` so it wins over Tailwind's `pb-*`
utilities in the cascade. It matches the three breakpoints of the main scroll
area's padding:

```css
.page-pb-safe {
  padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px)); /* p-6 */
}
@media (min-width: 640px) {
  .page-pb-safe { padding-bottom: calc(2rem   + env(safe-area-inset-bottom, 0px)); } /* sm:p-8 */
}
@media (min-width: 1024px) {
  .page-pb-safe { padding-bottom: calc(2.5rem + env(safe-area-inset-bottom, 0px)); } /* lg:p-10 */
}
```

If you change the main content padding breakpoints, update these values too.

---

## Touch Target Rules

Apple HIG and WCAG 2.5.5 both require **44 × 44 pt minimum** for interactive
touch targets. All tappable elements must meet this. Enforce it with padding, not
size overrides on the visible element.

| Element | Approach |
|---|---|
| Sidebar nav links | `py-3` (24px × 2 + line-height ≈ 44px) |
| Sidebar sign-out button | `py-3` |
| TopBar hamburger button | `w-11 h-11` (44px square) |
| Primary / secondary buttons | `py-2.5` minimum (`min-h-[44px]` where needed) |
| Tab row buttons (Lessons) | `py-3` |
| Send / icon-only buttons | `w-11 h-11` (44px square) |
| Disabled interaction placeholders | Add `min-h-[44px]` so disabled buttons still meet the guideline |

Never make a tappable element smaller than 44px in either dimension, even if the
visible label is tiny. Use padding to extend the hit area invisibly.

---

## Page Layout Conventions

Every protected page wraps its content in:

```jsx
<div className="max-w-4xl space-y-10">   {/* or space-y-8 for denser pages */}
  <div>  {/* Page header */}
    <h2 className="text-2xl font-bold tracking-tight text-slate-900">…</h2>
    <p className="text-sm text-slate-500 mt-1.5">…</p>
  </div>
  {/* … sections … */}
</div>
```

Settings uses `max-w-lg` (single-column form). All other pages use `max-w-4xl`.

Section labels above grids or lists follow this pattern:

```jsx
<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
  Label
</p>
```

---

## Placeholder / Coming-Soon Pattern

For unbuilt features during Phase 0 scaffolding:

- **Disabled inputs:** `disabled` attribute + `cursor-not-allowed opacity-50` (or 60)
- **Disabled buttons:** `disabled` attribute + `cursor-not-allowed` + muted colors
  (`bg-slate-100 text-slate-400`)
- **Tooltip:** `title="Coming soon"` on every disabled interactive element
- **Banner:** amber info banner for page-level notice:

```jsx
<div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
  <Info size={16} className="text-amber-500 shrink-0" />
  <p className="text-sm text-amber-700">Feature is launching soon…</p>
</div>
```

- **Pill badge:** `text-[10px] font-bold uppercase tracking-wide bg-violet-100 text-violet-600 px-2.5 py-1 rounded-full`
  (swap color for the feature's accent)

---

## Commit Conventions

Messages follow: `Area: what changed` with a blank line then detail bullets.
Always append the session URL on the last line:
`https://claude.ai/code/session_0122gDqKQg7CKRGn6DAdoYw1`

---

## Branch

Active development branch: `claude/scaffold-dashboard-ui-9ZJz0`
