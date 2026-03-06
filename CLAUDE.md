# SEU Development - Project Guidelines

## Project Overview
SEU Development corporate website built with Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui, Prisma + MongoDB. Real estate company based in Georgia.

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
| `--primary-green`    | `#FF6B35` | `bg-primary-green`   | CTA buttons (orange)       |
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
- Headings: `font-[--font-bodoni] font-normal text-[2.5rem]`
- Nav/Body: `font-montserrat font-medium text-lg`
- Always use design-specified font, size, weight, and letter-spacing

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
- `font-[18px]` should be `text-[18px]` in header links
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
