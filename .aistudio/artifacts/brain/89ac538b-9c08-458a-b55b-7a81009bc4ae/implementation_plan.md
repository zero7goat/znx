# Implementation Plan - Dedicated About Page (`#/about`)

Build a dedicated, beautifully styled **About Page** accessible via the navigation bar's **ABOUT** button (hash route `#/about`). The page will follow the established dark ultra-sleek aesthetic, matching typography, colors, animations, Lenis smooth scrolling, CTA banner, and identical footer.

---

## 1. User Intent & Key Requirements

- **Route Integration**: Add `#/about` hash routing support in `App.tsx` and connect the `ABOUT` button in `Navbar.tsx`.
- **Consistent Visual Theme**: Use the exact design tokens, dark background (`bg-[#0a0a0a]` / `bg-[#0c0c0c]`), high contrast typography (`font-bodoni`, `font-syne`, `font-instrument`, `font-mono`), and smooth motion transitions.
- **Content Structure**:
  1. **Hero Story**: Bold header headline with subtle badges and high-impact introductory statement.
  2. **Studio Philosophy**: High-level manifesto detailing digital craftsmanship and vision.
  3. **Minimalist Founder Bio**: Highlight creative leadership and vision with minimalist typography card.
  4. **Core Values**: Grid of key principles (Design Integrity, Engineering Rigor, Boundary-Pushing Innovation, Human Focus).
  5. **Clients & Partners**: Elegant marquee or grid of brands/collaborators.
  6. **Call-To-Action (CTA)**: Premium black card container with glowing borders, matching the Services & Works pages with `shadow-md shadow-black/20`.
  7. **Footer**: Integrated global footer component (`Footer.tsx`).
- **Smooth Scroll**: Integrated Lenis inertia scroll engine for smooth fluid scrolling on PC & mobile.

---

## 2. Component Architecture & Routing Flow

```
                        +----------------------+
                        |      Navbar.tsx      |
                        +----------+-----------+
                                   | (Click 'ABOUT')
                                   v
                        +----------------------+
                        |   Hash: #/about      |
                        +----------+-----------+
                                   |
                                   v
                        +----------------------+
                        |       App.tsx        |
                        +----------+-----------+
                                   |
                                   v
                        +----------------------+
                        |    AboutPage.tsx     |
                        +----------+-----------+
                                   |
  +------------------+-------------+-------------+------------------+
  |                  |                           |                  |
  v                  v                           v                  v
[Hero & Story] [Philosophy & Values]     [Founder Bio & Clients]  [CTA & Footer]
```

### State Updates in `App.tsx`:
- State variable `isAboutPageOpen` (boolean).
- Syncing hash state in `useEffect` for `#/about`.
- Handling `onSelectTab('about')` to trigger smooth transition and scroll reset.

---

## 3. Visual Styling & Typography Mapping

| Element | CSS / Font Class | Style Description |
| :--- | :--- | :--- |
| Main Page Background | `bg-[#0a0a0a]` | Dark midnight theme consistent with homepage |
| Primary Headlines | `font-bodoni` / `Bodoni Moda` | Elegant serif for section titles and hero statement |
| Sub-headlines & Accent Titles | `font-syne` | Bold modern geometric display sans |
| Body & Descriptions | `font-instrument` | Clean editorial sans for copy |
| Labels, Badges & Numbers | `font-mono` / `text-xs tracking-widest` | High-tech uppercase tags |
| CTA Container | `bg-[#0c0c0c]` + `shadow-md shadow-black/20` | Subtle, clean dark card |

---

## 4. Proposed Implementation Steps

### Step 1: Create `src/components/AboutPage.tsx`
- Build a full-page component featuring:
  - Hero Header with large `font-bodoni` headline (*"Crafting meaningful digital art and systems."*).
  - Story & Manifesto section.
  - Studio Philosophy cards with smooth hover states.
  - Minimalist Founder Bio section.
  - Grid of Core Values with subtle borders (`border-white/10`).
  - Clients & Collaborators list.
  - Unified CTA banner (*"Ready to create something legendary?"*).
  - Render `Footer` at the end.

### Step 2: Update App Routing in `App.tsx`
- Add `isAboutPageOpen` state.
- Include `#/about` in hash change handler.
- Add transition logic in `handleOpenAboutPage`.
- Render `<AboutPage />` conditionally when `isAboutPageOpen` is `true`.

### Step 3: Connect Navigation in `Navbar.tsx` & `Footer.tsx`
- Map `ABOUT` tab click to set location hash to `#/about` or trigger `handleOpenAboutPage`.
- Ensure active indicator correctly highlights when on `#/about`.

---

## 5. Verification & Testing

1. **Route Test**: Verify clicking **ABOUT** in the header or footer smoothly updates URL hash to `#/about` and displays the page.
2. **Typography Verification**: Ensure `font-bodoni`, `font-syne`, and `font-instrument` render properly without missing fonts.
3. **Responsive Check**: Test layout and typography scaling on both desktop and mobile viewports.
4. **Build & Lint Validation**: Run `compile_applet` and `lint_applet` to confirm zero errors.
