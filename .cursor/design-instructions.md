# DESIGN SPEC — Quasar SPA (Students & Classes)

**Objective:** Produce a clear, reusable design specification for a single-page application (Quasar + Material) that manages students and classes. The app is light-theme, academic in tone, spacious, and uses serif headings with sans-serif body copy. The final deliverable will live as `DESIGN-SPEC.md` in the repository and should be used by designers and developers as the single source of truth for visual and interaction choices.

---

## Table of contents

1. Overview
2. Brand & Vibe
3. Color system (light-only)
4. Typography
5. Spacing, grids & layout
6. Navigation
7. Component library & patterns

   * Top app bar
   * Mobile navigation
   * Lists & Tables (card-table)
   * Forms & modals
   * Class detail view
   * Assign / Remove students interaction
   * Buttons / Icons / Inputs
8. Data & global store shape (Pinia)
9. Accessibility
10. Internationalization (PL / EN)
11. Responsive behavior
12. Git & delivery guidelines
13. Optional add-ons

---

## 1. Overview

* Target users: teachers, school admins, academic staff — efficient, readable UI with calm, academic styling.
* Must work without login (local state first; optional backend later).
* Visual style: light, spacious, neutral; tables should feel friendly (card-like surfaces) rather than dense spreadsheets.
* Framework: Quasar (Material design tokens + custom theming).

---

## 2. Brand & Vibe

* Tone: Academic, calm, trustworthy, professional.
* Visual language: plenty of whitespace, subtle surfaces, classic typography (serif headings for gravitas, sans-serif for body for readability).
* imagery: minimal. Use small, tasteful line-illustrations only for empty states.

---

## 3. Color system (light-only)

All colors chosen to keep a light palette while preserving readable contrast.

**Surface & neutrals**

* Background (page): `#FFFFFF` (white)
* App surface / main cards: `#FAFBFC` (very light neutral)
* Card border / divider: `#E6EEF5` (soft cool border)
* Muted surface: `#F4F7FA`

**Text**

* Heading color: `#0B1A2B` (very deep but used sparingly for headings)
* Body text: `#263238` (neutral readable for paragraph copy)
* Muted text: `#6B7280`

**Palette (action colors)**

* Primary (academic blue): `#2B6CB0` — used for primary actions, links, active states.
* Accent (soft slate-blue): `#8AA4C6` — subtle accents, secondary UI elements.
* Success: `#16A34A` (for confirmations)
* Danger: `#DC2626` (for destructive actions)
* Warning: `#F59E0B`

**Notes:**

* Avoid heavy/dark backgrounds. Use medium-blue primary to contrast with white surfaces.
* Use color sparingly for emphasis — rely on spacing and typography for hierarchy.

---

## 4. Typography

**Goal:** Serif for headings (academic feel), sans-serif for body (legibility).

**Fonts (Google fonts recommended)**

* Headings: **Merriweather**, weights: 700 (H1/H2), 600 (H3/H4)
* Body: **Inter** (or Roboto), weights: 400 (body), 600 (strong)

**Scale**

* H1 — 28px / 1.6em — Merriweather 700
* H2 — 22px — Merriweather 700
* H3 — 18px — Merriweather 600
* Body — 16px — Inter 400
* Small/caption — 13px — Inter 400

**Line height & contrast**

* Body line-height: 1.6 for comfortable reading.
* Headings should have slightly tighter line-height (1.25) and larger spacing below.

---

## 5. Spacing, grids & layout

**Spacing tokens (example)**

* xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 40px

**Container widths / breakpoints**

* Mobile: up to 599px
* Tablet: 600–1023px
* Desktop: 1024px and up (max content width 1200–1280px center aligned)

**Grid**

* Use a single-column flow for mobile; two-column or split layouts for larger screens (e.g., list + detail panes).

**Card corners & elevation**

* Border radius: 10px for cards; 8px for smaller controls.
* Shadow: subtle (e.g., `0 6px 18px rgba(27, 39, 58, 0.06)`) to create separation without heavy contrast.

---

## 6. Navigation

**Desktop**

* Top app bar (fixed / sticky): left-aligned app title, center optional page title, right-side quick actions (Add student, language switcher, settings).
* Keep top bar height \~64px for spacious feel.

**Mobile**

* Right-side floating bottom sheet / slide-in mobile nav triggered by an icon (hamburger or kebab). The mobile bar hosts primary navigation items and the language switcher.
* Language switcher location: inside the nav menu (top-right edge of the menu) so it’s discoverable but not intrusive.

**Nav items**

* Students (list view)
* Classes (list view)
* (Optional) About / Help

---

## 7. Component library & patterns

Quasar components + custom styling to match tokens.

### Top app bar

* Title (Merriweather, H3). Secondary actions on the right: `+ Add student` (primary button), language selector (toggle), and a small `Help` icon.

### Mobile navigation

* Slide-in panel from right (Quasar `Drawer` or `Dialog`), items shown as stacked buttons with icons. Include language switcher and a floating Add button.

### Lists & Tables ("card-table")

Design: use a card surface that contains a neutral table. The card gives breathing room around rows and feels less dense.

* Card header: title (e.g., "Students"), small search input, `+ Add` button.
* Table rows: compact, with subtle separators. Columns: First name | Last name | Class(s) | Actions
* Row actions: small icon button group (Assign, Edit, Remove). Keep iconography minimal (Material Icons).
* Sorting: clickable column headers with a subtle affordance.
* Pagination: simple numeric or infinite scroll for medium datasets.

**Row hover**: gentle elevation change and background tint (`#F4F7FA`).

### Forms & modals

* Use `Dialog` for quick add/edit forms (one-step). Keep forms minimal:

  * Add Student: First name (required), Last name (required), optional Class assignment (multi-select).
  * Validations: required fields, max length 64 chars.

* Larger edit screens: full page if future needs grow, but default to dialogs for speed.

### Class detail view

* When a class is selected, show a detail page (or right-hand pane on wide screens): class name, description (optional), and a card-table of assigned students.
* Actions inside detail: `Assign Students` (opens assign dialog), `Remove from class` inline action.

### Assign / Remove students UX

Preferred: **Dialog with a dual-list (transfer) control**.

* Left pane: Available students (searchable). Right pane: Assigned students.
* Provide multi-select, `Add selected`, `Remove selected` buttons, and quick `Assign all` / `Clear` actions.
* Accessibility: keyboard support for list item selection and ARIA labels.

Alternative lighter UX: inline multi-select on class detail with checkboxes alongside students.

### Buttons / Icons / Inputs

* Primary actions: filled button with primary color.
* Secondary actions: subtle outline or text button.
* Icon-only actions: circular tappable targets 40x40px.

---

## 8. Data & global store (Pinia)

**Data shapes** (example JSON)

```json
// Student
{
  id: "s_01",
  firstName: "Ada",
  lastName: "Lovelace",
  classIds: ["c_01"]
}

// Class
{
  id: "c_01",
  name: "Mathematics 101",
  description: "Intro to algebra"
}
```

**Pinia store modules**

* `useStudentsStore` — `students: Student[]` and actions: addStudent, editStudent, removeStudent, assignToClass, removeFromClass
* `useClassesStore` — `classes: Class[]` and actions: addClass, editClass, removeClass
* Optionally, a root `useUiStore` for theme, language, and transient UI state (toasts, dialogs)

**Persistence**

* Initially: browser `localStorage` (serialize state on change). Provide a migration path to BaaS later.

---

## 9. Accessibility

* Contrast: ensure text contrast meets AA for body copy (use `#263238` on white).
* Keyboard: all interactive elements reachable & operable via keyboard.
* ARIA labels: dialogs, transfer lists, and tables must have appropriate ARIA roles.
* Focus states: visible, 2px outline (not only color change).

---

## 10. Internationalization (PL / EN)

* Use Quasar `i18n` or vue-i18n integration.
* Default: English (configurable). Persist user choice in `localStorage`.
* Copy style: friendly, professional. Provide both formal and neutral translations; prefer neutral for admin audiences.
* Place language switcher in the nav (desktop right, mobile inside drawer).

---

## 11. Responsive behavior

* Desktop: Top nav + content centered; class details can appear as right-side pane.
* Tablet: Top nav, content stacks but keep tables as cards.
* Mobile: Single column, slide-in nav on right. Use compact rows; actions should collapse into an overflow menu.

Breakpoints to implement: 0–599 (mobile), 600–1023 (tablet), 1024+ (desktop)

---

## 12. Git & delivery guidelines

**Branch naming**

* `feat/<short-description>` — new features
* `fix/<short-description>` — bug fixes
* `chore/<...>` — maintenance
* `docs/<...>` — documentation

**Commit messages**

* Keep English, imperative tense: `feat: add student dialog and form validation`
* Keep commits focused and small. Use PRs for merging into `main`.

**Repository contents**

* `DESIGN-SPEC.md` (this file)
* `README.md` with run / build / deploy instructions
* `src/` (Quasar app), `stores/` (Pinia), `i18n/` (translations), `docs/` (design assets)

---

## 13. Optional add-ons

* **Hosting:** deploy to Vercel or Netlify (Quasar can be built as SPA). Provide a `netlify.toml` or Vercel project settings.
* **Backend:** Supabase/Firebase for persistence. If added, spec the REST contract (simple `GET /students`, `POST /students`, `PATCH /students/:id`, `GET /classes`, `POST /classes`, etc.). Use axios and create an API wrapper service.
* **Further UI:** dark mode later; more illustrations for empty states.

---

### Appendix: Example microcopy

* Empty students list: *"No students yet — click Add to create the first student."*
* Confirm delete: *"Remove student "Ada Lovelace" from the system? This cannot be undone."*

---

