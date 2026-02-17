# Sentria Frontend Redesign Plan

## Current State Assessment

Sentria is a **community-driven disaster response platform** -- this purpose demands a UI that feels **trustworthy, scannable, and calm under pressure**. The current design has functional components but lacks the visual refinement and hierarchy that a crisis-response tool needs.

### Key Issues Identified

| Area                   | Problem                                                                                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Color system**       | Only 6 flat colors. Off-white `#f5fefd` has a green tint that muddies backgrounds. No semantic depth (no light/dark variants of primary).                         |
| **Typography scale**   | Font sizes are scattered: 32px, 16px, 14px, 12px, 10px. No consistent type ramp. Body text at `font-extralight` is too thin for readability in crisis contexts.   |
| **Layout**             | Dual navigation (sidebar + top nav) creates cognitive load. Sidebar is underutilized -- only 2 items + logout. NavBar packs icons, search, and CTAs into one row. |
| **Spacing**            | Inconsistent padding/margins across components. Cards, modals, and sections each use different spacing logic.                                                     |
| **Visual hierarchy**   | Everything competes for attention. Trust scores, disaster badges, usernames, timestamps, and actions all feel equally weighted.                                   |
| **Borders & surfaces** | Heavy use of `border-black/30` everywhere looks dated. No elevation system (shadows are barely used).                                                             |
| **Buttons**            | Inline button styles in NavBar don't match the `Button` component variants. Inconsistent height, padding, and radius.                                             |

---

## Redesign Direction

**Design Philosophy:** Clean institutional minimalism -- like a cross between **Linear** (precision, whitespace) and **Google Crisis Response** (clarity, trust). The interface should feel like a tool built by people who take disasters seriously.

---

## 1. Color System Overhaul

Keep `#2e8b57` as the brand anchor, but build a proper semantic palette around it.

### Proposed Palette

```css
@theme {
  /* ── Brand ── */
  --color-primary: #2e8b57; /* Sea green - keep as-is */
  --color-primary-dark: #236b43; /* Hover/active states */
  --color-primary-light: #e8f5ee; /* Light tint for backgrounds, badges */
  --color-primary-50: #f0faf4; /* Subtle wash for selected rows/cards */

  /* ── Neutrals (warm gray, not blue-gray) ── */
  --color-white: #ffffff; /* True white backgrounds (not #f5fefd) */
  --color-gray-50: #fafafa; /* Page background */
  --color-gray-100: #f5f5f5; /* Card hover, secondary surfaces */
  --color-gray-200: #e5e5e5; /* Borders, dividers */
  --color-gray-400: #a3a3a3; /* Placeholder text, muted icons */
  --color-gray-500: #737373; /* Secondary text */
  --color-gray-700: #404040; /* Primary body text */
  --color-gray-900: #171717; /* Headings, high-emphasis text */

  /* ── Semantic ── */
  --color-danger: #dc2626; /* Red-600 - destructive, debunked */
  --color-danger-light: #fef2f2; /* Red background tint */
  --color-warning: #f59e0b; /* Amber-500 - low trust warnings */
  --color-warning-light: #fffbeb; /* Amber background tint */
  --color-info: #2563eb; /* Blue-600 - secondary actions, verified badge */
  --color-info-light: #eff6ff; /* Blue background tint */
  --color-success: #16a34a; /* Green-600 - confirmations */

  /* ── Typography ── */
  --font-sans: 'Inter', 'Poppins', system-ui, sans-serif;
}
```

### Why These Changes

- **True white `#ffffff`** instead of `#f5fefd` -- removes the green-tinted muddiness from backgrounds
- **Warm neutral grays** -- professional and easy on the eyes for long reading sessions during crises
- **Primary variants** -- `primary-light` for badges/tags, `primary-dark` for hover states creates depth without new colors
- **Semantic colors** -- Red for danger/debunked, amber for warnings, blue for info. Each gets a light tint for backgrounds
- **Inter font** -- Consider adding Inter as the primary (it's the most readable UI font at small sizes). Keep Poppins as fallback for brand continuity

---

## 2. Typography Scale

Establish a strict type ramp. Every text element should map to one of these.

```
Display:    32px / 40px line-height / font-semibold  → Page titles (Login welcome)
Heading 1:  24px / 32px / font-semibold              → Section headers
Heading 2:  20px / 28px / font-medium                → Card titles, modal headers
Heading 3:  16px / 24px / font-medium                → Subsection labels
Body:       14px / 22px / font-normal                 → Primary content (NOT extralight)
Body Small: 13px / 20px / font-normal                 → Secondary content, descriptions
Caption:    12px / 16px / font-medium                 → Timestamps, metadata, badges
Micro:      11px / 14px / font-medium                 → Tiny labels, trust scores
```

### Key Typography Fixes

- **Kill `font-extralight` and `font-light` for body text.** In disaster contexts, people are stressed and scanning fast. Regular weight (400) is the minimum for body copy.
- **Use `font-medium` (500) for labels and metadata**, not `font-semibold` -- it's more refined.
- **Headings at `font-semibold` (600)**, reserve `font-bold` (700) for extreme emphasis only.

---

## 3. Layout Architecture

### Option A: Modernized Sidebar (Recommended)

Keep the sidebar but redesign it to be more useful and less decorative.

```
┌─────────────────────────────────────────────────────────┐
│ [Logo]                                                   │
│                                                          │
│  MAIN                                                    │
│  ○ Home                    ┌──────────────────────────┐  │
│  ○ Map                     │ Search...          [+New] │  │
│  ○ Resources               ├──────────────────────────┤  │
│                            │                          │  │
│  PERSONAL                  │  Feed Content / Map      │  │
│  ○ Favorites               │                          │  │
│  ○ Notifications           │                          │  │
│                            │                          │  │
│  ─────────                 │                          │  │
│  ○ Language                │                          │  │
│  ○ Logout                  │                          │  │
│                  [Avatar]  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Changes:**

- **Move ALL navigation into the sidebar** (Home, Map, Resources, Favorites, Notifications). This eliminates the icon row in the NavBar.
- **NavBar becomes a simple contextual toolbar:** page title on left, search in center, primary action + avatar on right.
- **Sidebar width:** Fixed at `240px` (not `256px` / `w-64`). Collapsed state: `64px` with icon-only mode.
- **Group sidebar items** with subtle section labels ("MAIN", "PERSONAL") like Linear/Notion.
- **User avatar at sidebar bottom** instead of NavBar.

### Option B: Top Navigation Only

Remove the sidebar entirely. Put navigation in a clean top bar.

```
┌──────────────────────────────────────────────────────┐
│ [Logo]   Home  Map  Resources  |  [Search]  [+] [👤] │
├──────────────────────────────────────────────────────┤
│                                                      │
│              Feed Content / Map                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

This is simpler but gives less room for future features. **Recommend Option A.**

---

## 4. Component Redesign Specs

### 4.1 PostCard (The Most Critical Component)

The current PostCard has too many visual elements at the same weight. Redesign with clear information hierarchy:

**Structure (top to bottom):**

```
┌──────────────────────────────────────────────────┐
│  [Avatar] Name · Verified ✓ · 3h ago     [Score] │  ← Header row (single line)
│                                                    │
│  📍 Yangon, Myanmar                               │  ← Location (primary-dark, medium weight)
│  Earthquake Report: 5.2 Magnitude Detected         │  ← Title (heading-2 weight)
│                                                    │
│  Description text here in regular weight, not      │  ← Body (14px, normal weight, gray-700)
│  extralight. Truncated at 2 lines with "more"...   │
│                                                    │
│  [img] [img] [img]                                 │  ← Images (rounded-lg, subtle border)
│                                                    │
│  ─────────────────────────────────────────────── │
│  ▲ 24  ▼ 3  💬 12                    [Earthquake] │  ← Actions + disaster badge
└──────────────────────────────────────────────────┘
```

**Key changes:**

- **Trust score warning** becomes a subtle top-edge colored bar (2px height) instead of a floating tab -- cleaner, still visible
- **Disaster type badge** moves to bottom-right action row (de-clutters the header)
- **Debunked state:** Entire card gets a `border-left: 3px solid var(--danger)` + muted overlay. Much clearer than a small badge.
- **Remove border-black/30** -- use `border border-gray-200` with `hover:shadow-sm` transition
- **Card spacing:** `p-5` consistent padding, `gap-3` between sections

### 4.2 Button Component

Simplify to 4 variants with a `size` prop:

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'
```

**Styling:**

- `primary`: `bg-primary text-white hover:bg-primary-dark` -- solid green
- `secondary`: `bg-gray-100 text-gray-700 hover:bg-gray-200` -- subtle gray (NOT blue)
- `outline`: `border border-gray-200 text-gray-700 hover:bg-gray-50` -- minimal
- `ghost`: `text-gray-500 hover:text-gray-700 hover:bg-gray-100` -- for icon buttons
- `danger`: `bg-danger text-white hover:bg-red-700` -- destructive actions

**Sizes:**

- `sm`: `h-8 px-3 text-sm rounded-md`
- `md`: `h-10 px-4 text-sm rounded-lg` (default)
- `lg`: `h-12 px-6 text-base rounded-lg`

**Remove** `min-h-[50px]` -- it makes buttons too tall for modern UI. `h-10` (40px) is the sweet spot.

### 4.3 Input Component

- Border: `border-gray-200` default, `border-primary` on focus (with `ring-2 ring-primary/20` glow)
- Height: `h-10` (matches button md)
- Text: `text-sm` body, `text-gray-400` placeholder
- Error state: `border-danger` with `text-danger text-xs mt-1` message below
- Remove the primary/secondary variant system -- inputs should look consistent everywhere

### 4.4 Sidebar

```
Width: 240px (expanded) / 64px (collapsed)
Background: white
Border-right: 1px solid var(--gray-200)
No rounded corners (flush to viewport edge is cleaner)

Items:
- Height: 36px
- Padding: px-3
- Border-radius: 6px (rounded-md)
- Default: text-gray-500
- Hover: bg-gray-100 text-gray-700
- Active: bg-primary-light text-primary font-medium

Section labels:
- text-[11px] font-medium text-gray-400 uppercase tracking-wider
- px-3 mb-1
```

### 4.5 NavBar

Simplify dramatically:

```
Height: 56px
Background: white
Border-bottom: 1px solid var(--gray-200)
Padding: 0 24px

Left: Page title (h3, font-medium)
Center: Search input (max-w-md)
Right: Primary action button + Avatar dropdown
```

No more icon navigation row. No more dual button layouts for map/non-map pages.

---

## 5. Spacing & Layout Tokens

```css
/* Consistent spacing scale */
--space-page-x: 24px; /* Page horizontal padding */
--space-page-y: 24px; /* Page vertical padding */
--space-card-padding: 20px; /* Card internal padding */
--space-section-gap: 24px; /* Gap between major sections */
--space-item-gap: 12px; /* Gap between related items */
--space-inline-gap: 8px; /* Gap between inline elements */
```

### Content Width

- Feed content: `max-w-2xl` (672px) -- centered, not 3/4 width. Social feeds are more readable narrow.
- Map page: Full width (with sidebar)
- Modals: `max-w-lg` (512px) for forms, `max-w-2xl` for detail views

---

## 6. Surface & Elevation System

Replace the current flat + heavy border approach:

```
Level 0 (page bg):     bg-gray-50
Level 1 (cards):       bg-white border border-gray-200
Level 1 hover:         bg-white border border-gray-200 shadow-sm
Level 2 (dropdowns):   bg-white shadow-lg border border-gray-200 rounded-lg
Level 3 (modals):      bg-white shadow-xl rounded-xl + backdrop blur overlay
```

**Borders:** Always `border-gray-200` (light, consistent). Never `border-black/30`.

---

## 7. Interaction & Animation

Keep animations subtle and functional:

```css
/* Standard transitions */
transition-colors: 150ms ease
transition-shadow: 200ms ease
transition-transform: 150ms ease

/* Page entrance */
fade-in + translateY(8px → 0): 300ms ease-out

/* Modal entrance */
fade-in + scale(0.95 → 1): 200ms ease-out

/* Sidebar collapse */
width transition: 200ms ease-in-out
```

**Remove** the complex loader animation (rotating circles). Replace with a simple branded spinner or skeleton screens (which you already have).

---

## 8. Auth Pages (Login/Register)

Current layout works but needs polish:

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│    [Left: Brand panel]      │   [Right: Form]       │
│    bg-primary               │   bg-white             │
│    Logo (large, white)      │                        │
│    "Stay safe.              │   Welcome Back         │
│     Stay connected."        │   Sign in to continue  │
│                             │                        │
│    Subtle pattern/           │   [Email input]       │
│    illustration              │   [Password input]    │
│                             │   [Login] [Forgot?]   │
│                             │                        │
│                             │   ──────────────       │
│                             │   [Create Account]     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

- Split layout: left brand panel (primary green bg) + right form panel
- This is standard for SaaS/professional apps and immediately looks more polished than a centered form alone

---

## 9. Map Page Adjustments

- Remove the sidebar collapse behavior. Instead, use a persistent narrow sidebar (64px) on map page OR hide sidebar entirely and use a floating panel.
- Activity feed on map page: Use a **sliding drawer** from the right (like Google Maps) rather than a fixed panel. This gives the map more room.
- Map markers: Use the `primary` green and `danger` red with proper contrast. Add a subtle white border around markers for visibility.

---

## 10. Implementation Priority

### Phase 1 - Foundation (Do First)

1. Update `index.css` with new color tokens and typography
2. Add Inter font (or refine Poppins usage)
3. Redesign `Button` component with new variant system
4. Redesign `Input` component
5. Update global border and surface styles

### Phase 2 - Layout

6. Redesign `Sidebar` with full navigation
7. Simplify `NavBar` to contextual toolbar
8. Update `LayoutWithAuth` for new layout structure
9. Set feed content to `max-w-2xl` centered

### Phase 3 - Components

10. Redesign `PostCard` with new hierarchy
11. Update all modals (CreatePost, ActivityPost, ReportDetail)
12. Update `ResourceCard`
13. Update `ProfileNav` and profile page

### Phase 4 - Pages

14. Redesign auth pages (Login, Register) with split layout
15. Polish map page with drawer pattern
16. Update onboarding flow
17. Final responsive pass

---

## Summary

The goal is to transform Sentria from a "student project with green buttons" into a **polished crisis-response tool that people trust with their safety**. Every design decision should answer: _"Does this help someone find critical information faster during a disaster?"_

Keep: Logo, Primary green `#2e8b57`, Poppins font, Existing component architecture
Change: Color depth, Typography weight/scale, Layout structure, Spacing consistency, Surface/elevation system, Component refinement
