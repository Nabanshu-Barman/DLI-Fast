# DLI Fast — Frontend Reference

## Stack
- Framework: Next.js (App Router, using `--turbopack`)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Library: Custom / shadcn/ui components (lucide-react for icons)
- Auth State: JWT stored in `localStorage` (key: `dli_jwt`)
- API Wrapper: `src/lib/apiClient.ts`

## Design System
- Overall Theme: Dark terminal / cyber-industrial aesthetic (fintech-theme styling)
- Background: `#111111` (primary), `#1a1a1a` (cards/panels)
- Primary accent: `#9ded10` (neon high-vis lime green)
- Secondary accent: `#c084fc` (purple, used for multipliers/special badges)
- Text primary: `#ffffff`
- Text secondary: Gray scale (`text-gray-400`, `text-gray-500`)
- Border color: `rgba(255, 255, 255, 0.05)` (white/5) or `rgba(157, 237, 16, 0.3)`
- Font style: Monospace/Terminal font primary (`font-mono`), uppercase emphasis
- Actions: All buttons are uppercase, heavily tracked (`tracking-widest`), blocky design.

## Pages & Routes
| Route | View Component | Auth required | Role Required |
|---|---|---|---|
| `/` | `HeroSection` / Landing | No | None |
| `/login` | `LoginView` | No | None |
| `/dashboard` | `DashboardView` | Yes | Member |
| `/catalogue` | `CatalogueView` | Yes | Member |
| `/tasks` | `BountyBoardView` | Yes | Member |
| `/admin` | `AdminView` | Yes | Admin |
| `/admin/queue` | `PointApprovalQueueView` | Yes | Admin |

## API Client Architecture 
- Handled exclusively via our custom wrapper in `@/lib/apiClient.ts`
- Expected payload returns: `{ success: boolean, data: any, message?: string }`
- All requests implicitly send `Authorization: Bearer <token>` 
- Token read from `localStorage.getItem('dli_jwt')`
- On `401 Unauthorized` responses: Token is stripped/cleared automatically and the app redirects to `/login`.

## Component Conventions
- **Client Components**: Because of interactions and side effects, most views use `'use client'` directive.
- **Loading States**: Required on all network-dependent mounts. Handled via `<Skeleton />` loaders mimicking the target UI shapes.
- **Numbers & Decimals**: Points mapped from the backend `Decimal128` types are safely floored/parsed as JavaScript `number` variables for the UI. No raw object references shown.
- **IDs**: Raw ObjectIds are either hidden entirely, or truncated to short 6-8 character tracking codes (e.g. `ID: a1b2c3d4`).
- **Layout & Positioning**: Inline Tailwind utilities used over stylesheets. Glass/opacity borders used to maintain depth.