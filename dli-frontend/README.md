# FAST

## DLI Points and Progress Management Platform (Frontend)

Built for the **FAST Club** as the user-facing application for managing DLI course discovery, points, redemption flow, and progress insights.

- Project Name: `FAST - DLI Points and Progress Management Platform`
- Target Production Deployment Date: `March 30, 2026`
- Current Repository Scope: `Frontend (Next.js + React)`

---

## 1. Project Vision

FAST is building a secure and scalable platform that acts as a central distribution and tracking hub for Deep Learning Institute (DLI) courses.

The product goal is to provide:

- A smooth member experience for discovering and requesting courses
- A clear dashboard for points and redemption tracking
- A restricted admin interface for request handling and points control
- A robust backend architecture ready for secure production use

---

## 2. What Is Implemented In Frontend Right Now

This frontend is currently a polished, interactive SPA-style experience built inside Next.js (App Router), with mock data and simulated API delays.

### Implemented Views and Flows

1. Landing Experience
- Cinematic hero section with scroll-synced frame animation
- System specification highlights section
- FAST Club mission/about section
- Strong NVIDIA-inspired visual design system

2. Access Control UI (Member/Admin)
- Dedicated login screen with tabbed role selection
- Member and admin form variants
- Simulated loading and role-based view redirection

3. Course Catalogue
- Responsive course cards
- Search/filter UI controls (visual layer present)
- Course points display and request CTA
- Skeleton loading placeholders during data fetch simulation

4. Member Dashboard
- Points summary with animated counter
- Current active-course progress card
- Redemption history table with status badges
- Skeleton loading for initial state

5. Admin Panel
- Overview cards (members, points, pending requests)
- Request approval/rejection controls
- Manual points issuance form
- Empty-state behavior when requests are processed

6. Navigation and Theme Experience
- Sticky top navigation with login/logout state
- Role-aware nav links
- Dark-mode first styling and light/dark toggle for catalogue context

### Important Current State Notes

- Data source is currently mock/local (`src/lib/mock-data.ts`)
- Authentication is currently simulated (no JWT verification yet)
- No real backend API integration yet
- No persistent database connection yet

This is expected for the current milestone and provides a strong UI foundation for backend hookup.

---

## 3. Frontend Technology Stack

### Core Framework
- Next.js 15 (App Router)
- React 19
- TypeScript

### UI, Styling, and Motion
- Tailwind CSS
- shadcn/ui component architecture (Radix UI primitives)
- Lucide icons
- Framer Motion animations

### Forms, Validation, Utilities, and Data Viz
- React Hook Form
- Zod
- class-variance-authority
- clsx + tailwind-merge
- Recharts

### Additional Tooling Present
- Firebase SDK (available)
- Genkit + Google GenAI packages (available)

---

## 4. Local Development (Frontend)

### Prerequisites

- Node.js `>= 20.x` recommended
- npm (repo currently contains `package-lock.json`)

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Default local URL:

- `http://localhost:9002`

### Production Build and Run Locally

```bash
npm run build
npm run start
```

### Quality Commands

```bash
npm run lint
npm run typecheck
```

---

## 5. Project Structure (Frontend)

```text
dli-frontend/
	src/
		app/
			page.tsx               # Main SPA view switching container
			layout.tsx             # Root layout and metadata
			globals.css            # Global styles and theme variables
		components/
			HeroSection.tsx
			TechSpecsSection.tsx
			AboutSection.tsx
			LoginView.tsx
			CatalogueView.tsx
			DashboardView.tsx
			AdminView.tsx
			Navbar.tsx
			ui/                    # shadcn/radix UI primitives
		lib/
			mock-data.ts           # Temporary in-memory data
	public/frames/             # Hero animation frames
	docs/blueprint.md          # Design and UX blueprint notes
```

---

## 6. Backend Kickoff Guide (Where and How to Start)

You asked to include clear backend startup direction in this README. This section is the recommended way to begin implementation now.

### 6.1 Backend Scope

Backend must be a separate decoupled service:

- Stack: `Node.js + Express + MongoDB`
- Contract style: `REST JSON over HTTP`
- Security: `JWT + RBAC + validation/sanitization`

### 6.2 Suggested Directory Placement

Create backend as a sibling folder to this frontend:

```text
F.A.S.T/
	dli-frontend/
	dli-backend/
```

### 6.3 Recommended Backend Tech

- Express.js
- Mongoose
- jsonwebtoken
- bcrypt or bcryptjs
- zod (or express-validator)
- helmet
- cors
- express-rate-limit
- dotenv
- morgan

### 6.4 Backend Quick Start (Suggested Commands)

```bash
mkdir dli-backend
cd dli-backend
npm init -y
npm install express mongoose jsonwebtoken bcryptjs zod helmet cors express-rate-limit dotenv morgan
npm install -D nodemon typescript ts-node @types/node @types/express @types/jsonwebtoken
```

Then initialize TypeScript config and source layout:

```text
dli-backend/
	src/
		app.ts
		server.ts
		config/
		modules/
			auth/
			users/
			courses/
			redemptions/
			admin/
		middleware/
		utils/
	.env
```

### 6.5 Backend Environment Variables (Initial)

```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/fast_dli
JWT_ACCESS_SECRET=replace_with_secure_secret
JWT_REFRESH_SECRET=replace_with_secure_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:9002
```

### 6.6 Minimum API Modules To Build First

1. Auth + RBAC
- `POST /api/v1/auth/login`
- JWT issuance and refresh strategy
- role claim: `member` or `admin`

2. Course Catalogue
- `GET /api/v1/courses`

3. Member Dashboard
- `GET /api/v1/dashboard/me`
- Return points, active course, redemption history

4. Course Request Engine
- `POST /api/v1/requests`
- Validate user has enough points before creating request

5. Admin Workflows
- `GET /api/v1/admin/requests`
- `PATCH /api/v1/admin/requests/:id` (approve/reject)
- `POST /api/v1/admin/points/grant`

### 6.7 Database Collections (Initial)

- `users`
- `courses`
- `courseRequests`
- `redemptions`
- `pointLedger`

Critical rule: points must be transaction-safe and never become inconsistent.

---

## 7. Frontend-Backend Integration Plan

When backend is ready, replace mock data and simulated delays in UI with API calls.

### Frontend env variable to add

Create `.env.local` in frontend:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

### Integration sequence

1. Auth flow
- Replace simulated login with backend login endpoint
- Store access token safely (httpOnly cookie preferred via backend cookie strategy)

2. Catalogue fetch
- Load courses from API

3. Dashboard fetch
- Load points/active course/history from authenticated endpoint

4. Requests and admin actions
- Wire buttons/forms to backend mutations
- Add optimistic UI + error toasts

---

## 8. Security Standards (Implementation Checklist)

For production readiness, ensure all of the following are implemented in backend:

- Strict RBAC between member and admin paths
- JWT-based stateless authentication
- Input validation on every endpoint
- Input sanitization to prevent injection and malformed payloads
- Rate limiting on auth and sensitive routes
- Secure headers via Helmet
- Hash all passwords with bcrypt/bcryptjs
- Deny-by-default authorization policy

---

## 9. Engineering Workflow Requirements

- No direct push to `main`
- Use feature branches for all work
- Mandatory PR review before merge
- CI checks should block failing lint/type/test

Suggested branch naming:

- `feature/<area>-<ticket>`
- `fix/<area>-<ticket>`
- `chore/<topic>`

---

## 10. Current Gaps Before Production

- Backend service implementation pending
- Real authentication/session handling pending
- Real database and schema validation pending
- Automated tests not yet wired for end-to-end flows
- CI/CD policy enforcement to be finalized

---

## 11. Milestone and Deadline

- Official final production-ready deployment deadline: `March 30, 2026`

Suggested milestone split:

1. Frontend integration-ready refactor (API service layer)
2. Backend auth + RBAC + users module
3. Courses + dashboard + request engine
4. Admin operations + points ledger hardening
5. Test pass + security pass + deployment

---

## 12. Team Context

This platform is being developed by the **FAST Club development team** for managing DLI learning workflows and points economy in a secure, scalable, and high-performance way.

If you want, the next step can be generating a production-ready `dli-backend` starter scaffold with:

- Express + TypeScript base
- Auth module skeleton
- RBAC middleware
- Mongo models with validation
- Initial route contracts matching this frontend
