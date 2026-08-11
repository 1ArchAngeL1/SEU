# SEU Development - Project Guidelines

## Project Overview
SEU Development corporate website built with Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui. Real estate company based in Georgia.

## Asset Handling Rules

### Missing Assets - Placeholder Policy
- **Images:** When an image asset is not available, use a styled placeholder `<div>` with the SEU color palette (e.g., `bg-seu-dark` with a subtle icon or text label indicating what the image should be). Never leave a broken `<img>` or `<Image>` pointing to a non-existent file.
- **Icons:** When a specific icon is needed but unclear, use the closest Lucide React icon as a placeholder. Mark it with a `{/* PLACEHOLDER ICON */}` comment.
- **Logos:** Use a simple text/SVG fallback styled to match the brand (gold on dark). Mark with `{/* PLACEHOLDER LOGO */}`.

### Uncertain Existing Assets
- If unsure whether an asset exists in `/public`, **always use a placeholder** and mark it with a `{/* PLACEHOLDER: [description of what's needed] */}` comment.
- Ask the user to confirm asset availability before referencing real file paths.
- Never assume an image file exists without verification.

## Placeholder Marker Convention
All placeholders must include a comment in this format:
```
{/* PLACEHOLDER: [type] - [description] */}
```
Examples:
- `{/* PLACEHOLDER: IMAGE - Hero moon/planet visual */}`
- `{/* PLACEHOLDER: ICON - Search apartment icon */}`
- `{/* PLACEHOLDER: LOGO - Partner bank TBC logo */}`

This makes placeholders easy to find and replace later via search.

## Workflow Preferences

### Running the Project
- Claude does NOT run the dev server or build commands. The user runs the project themselves and reports back any issues.

### Component Design
- Components should be **transparent and composable** - no hardcoded background colors or `<section>` wrappers. Use a plain `<div>` as the root so the parent controls the background and placement.
- This allows reusing components across different sections/pages with different backgrounds.

### Self-Improvement Loop
- When the user gives instructions for future reference, they must be added to this file or a linked file immediately.
- This file is the single source of truth for project conventions and user preferences.
- Update or remove entries when the user corrects previous guidance.

### Public Visibility — the admin "Active" switch
The `isActive` switch on a **project**, a **building/block** or a **unit** is a kill-switch for the public site: the record and everything under it must disappear — apartments, visual search, deep links, dropdowns, all of it.

**The cascade is applied by the backend**, which every public read opts into with `visibleOnly=true`. A unit is public only when the unit, its block and its project are all active.

- Public pages fetch through the public hooks — `usePublicUnitsList()`, `usePublicUnit()`, `usePublicBuilding()`, `useActiveBuildingsByProject()`, `useActiveBuildings()`, `useActiveProjects()` — never `useUnitsList()` / `useUnit()` / `useBuilding()` / `useBuildingsByProject()` / `useAllProjects()`, which are the admin reads.
- Public and admin reads of the same record **must not share a react-query cache entry**: the key builders take the `visibleOnly` scope for this reason.
- Deep links to a deactivated record get a 404 from the API — pages call `notFound()` on `isNotFoundError(query.error)`.
- `src/lib/visibility.ts` (`isUnitVisible`, `isBuildingVisible`, `isProjectVisible`, `visibleUnits`, `visibleBuildings`) is the **second line of defence**: units and blocks arrive with their `project` / `building` relations populated including `isActive`, so anything that slips through is dropped before it renders. It needs no id sets.
- Counters (`totalBuildings`, `totalUnits`, `availableUnits`) are backend aggregates that still count deactivated blocks — recount from the blocks on show with `blockTotals()`.
- **Admin screens deliberately bypass all of this** — editors must keep seeing deactivated records.
- Backend gap: the floors controller accepts no `visibleOnly` (`/floors/by-building/:id`, `/floors/:id`), and `QueryFloorDto` would 400 on the extra param. Floors are safe only because both pages that show them gate on the block first — keep it that way, or plumb the flag through `FloorsService`, which already supports it.

### Test-Mode Notice
The public site carries a site-wide "this is a test version" disclaimer until launch.

- Component: `src/components/common/TestModeBanner.tsx` — a slim, **non-dismissible** bar mounted at the top of `src/app/[locale]/(main)/layout.tsx`, above the sticky header so it scrolls away. It is a server component: once switched off it renders nothing and ships no JS.
- Gate: `src/lib/site-mode.ts` reads `NEXT_PUBLIC_SITE_MODE`. It defaults to `test`, so a missing variable keeps the disclaimer up rather than silently hiding it on an unfinished site. Set `NEXT_PUBLIC_SITE_MODE=live` (and rebuild — `NEXT_PUBLIC_*` is inlined) to remove it.
- Copy lives in `messages/{en,ka}.json` under `testMode` (`label`, `message`) — never hardcode the text.
- Admin (`/admin/*`) and `/presentation/*` deliberately do not show it.
- Georgian has no uppercase form, so banner casing comes from the message string, not `text-transform: uppercase`.

### Design Spec Interpretation
- When the user provides CSS layout properties (top, left, width, height), **only use `height`** from layout properties. Ignore top/left/width as those are absolute positioning values from the design tool, not relevant to the responsive layout.

### Tailwind Sizing Priority
1. **Existing Tailwind classes first** (e.g., `px-4`, `gap-8`, `h-12`) — always prefer these.
2. **Arbitrary rem values** (e.g., `px-[6.25rem]`) — when no matching Tailwind class exists.
3. **Arbitrary px values** (e.g., `px-[100px]`) — absolute last resort, avoid when possible.

## Design System

### Main Design Colors (from Adobe XD — use these first)
| Token                | Value     | Tailwind Class       | Usage                      |
|----------------------|-----------|----------------------|----------------------------|
| `--dark-green`       | `#0D141D` | `bg-dark-green`      | Primary dark background    |
| `--secondary-black`  | `#282626` | `border-secondary-black` | Borders, dividers      |
| `--secondary-grey`   | `#A19C92` | `text-secondary-grey`| Muted text, input bg/40    |
| `--pale-gray`        | `#F4F0E9` | `text-pale-gray`     | Primary light text, borders|
| `--primary-orange`    | `#FF6B35` | `bg-primary-orange`   | CTA buttons (orange)       |
| `--black`            | `#040303` | `bg-black`           | Footer background          |
| `--navy-green`       | `#003253` | `bg-navy-green`      | TBD                        |
| `--blue`             | `#0087A3` | `text-blue`          | TBD                        |
| `--red`              | `#A30032` | `text-red`           | TBD                        |

### Legacy Colors (kept for older components, prefer main colors above)
| Token              | Value     | Usage                     |
|--------------------|-----------|---------------------------|
| `--seu-dark`       | `#0c1829` | Old primary background    |
| `--seu-cream-light`| `#f5efe6` | Close to `--pale-gray`, prefer `pale-gray` |

### Typography
- Fonts: Montserrat (primary), Bodoni MT (headings), Geist (sans) + Geist Mono
- Headings: `font-[--font-bodoni] font-normal text-seu-heading-lg`
- Nav/Body: `font-montserrat font-medium text-seu-body`
- Always use design-specified font, size, weight, and letter-spacing
- **Always use `seu-*` font size tokens** instead of arbitrary values or standard Tailwind text sizes

### Font Size Tokens
| Token | Size | Tailwind Class | Usage |
|---|---|---|---|
| `seu-caption-sm` | 12px / 0.75rem | `text-seu-caption-sm` | Labels, badges, metadata |
| `seu-caption` | 14px / 0.875rem | `text-seu-caption` | Small text, footnotes |
| `seu-body-sm` | 16px / 1rem | `text-seu-body-sm` | Form inputs, compact body |
| `seu-body` | 18px / 1.125rem | `text-seu-body` | Nav links, standard body |
| `seu-body-lg` | 20px / 1.25rem | `text-seu-body-lg` | Content paragraphs |
| `seu-body-xl` | 22px / 1.375rem | `text-seu-body-xl` | Large body text |
| `seu-subheading` | 24px / 1.5rem | `text-seu-subheading` | Card body, subtitles |
| `seu-subheading-lg` | 26px / 1.625rem | `text-seu-subheading-lg` | Large subtitles |
| `seu-heading` | 32px / 2rem | `text-seu-heading` | Section headings |
| `seu-heading-lg` | 40px / 2.5rem | `text-seu-heading-lg` | Large section headings |
| `seu-title` | 48px / 3rem | `text-seu-title` | Page titles |
| `seu-title-lg` | 56px / 3.5rem | `text-seu-title-lg` | Large display titles |
| `seu-title-xl` | 64px / 4rem | `text-seu-title-xl` | Hero display text |

### Component Patterns
- Sections use `py-20` vertical padding with `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` container
- Cards use `rounded-lg overflow-hidden` with gradient overlays
- Buttons: Gold solid (`bg-seu-gold`) or gold outlined (`border border-seu-gold`)
- Arrow icons are consistent across CTAs (right arrow SVG)

## Known Issues to Fix
- `Header.tsx` is unused (replaced by `header/header.desktop.tsx`)
- `Team.tsx` exports `Upcoming` - file should be renamed
- `layout.tsx` uses `h-dvw` instead of `h-dvh`
- `header.desktop.tsx` has typo "Developlment" and placeholder alt text "dwad"
- Nav links all point to `/racxa` (placeholder)
- No mobile header yet
- `globals.css` has conflicting body background rules (line 111 vs line 155)

## File Structure Notes
```
src/components/           - Page section components (Hero, Mission, etc.)
src/components/header/    - Header variants (desktop, mobile planned)
src/components/ui/        - shadcn/ui primitives
src/components/customized/ - Custom component variants
src/lib/                  - Utilities (prisma client, cn helper)
public/common/            - Shared brand assets
SEU design pngs/          - Reference design mockups
```
