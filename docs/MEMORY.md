# Project Memory & Context Tracker

## Current Status

- **Phase:** 4 (Admin Controls & Finishing)
- **Status:** COMPLETED
- **Phase:** 5 (Frontend Integration & UI Hydration)
- **Status:** IN PROGRESS
- **Next Phase:** 6 (Final Deployment)

## Completed Chunks

- **✅ CHUNK 1A (Init & Server):** Initialized `package.json`, installed dependencies (`express`, `mongoose`, `helmet`, `express-rate-limit`, etc.), created base `src/server.js` with fast-failure DB connection, rate limiting, and helmet.
- **✅ CHUNK 1B (Utilities):** Created `src/utils/decimal.utils.js` (for safe Decimal128 economy math) and `src/utils/serialize.js` (for standardizing API responses).
- **✅ CHUNK 1C (Models Batch 1):** Created `User`, `Course`, and `CourseRequest` schemas. Strict enforcement of `Decimal128` for balances.
- **✅ CHUNK 1D (Models Batch 2):** Created `Task`, `AuditLog`, `DliCode`, `Notification`, `Webhook`, and `Project` schemas. Implemented TTL indexes on `AuditLog` (90 days) and `Notification` (30 days).
- **✅ CHUNK 2A (Auth Middleware):** Created `verifyToken`, `requireAdmin`, and `requireMember`.
- **✅ CHUNK 2B (Auth Routes & Controllers):** Implemented `/login` route with JWT signing, `lastLoginAt` updates, strict error generalizations, rate limiting, and inputs validations.
- **✅ CHUNK 2C (Global Resiliency & Testing):** Tested `/login` endpoint via local integration with MongoDB Atlas. Debugged bcryptjs validation. Added global Catch-All error handler, production-safe `500` error masking, and graceful DB/HTTP shutdown hooks.
- **✅ CHUNK 3A (Courses & Dashboard Base):** Added `Course` controller with pagination and dynamic filtering. Added `Dashboard` controller aggregating user, courses, and active tasks. Secured all via RBAC and cleanly mounted correctly nested routes.
- **✅ CHUNK 3B (Course Requests):** Implemented `createRequest` controller and route. Included inventory checking, decimal math validations, `userBalanceAtRequest` snapshotting, and `AuditLog` creation.
- **✅ CHUNK 3C (Bounty Board Foundation - Tasks CRUD):** Implemented `getTasks` and `createTask` controllers and routes. Supports dynamic filtering, sorting by `points.effective`, and admin-only creation with multiplier math logic.

## Technical & Architectural Notes

- **Economy Precision:** Native JS numbers are strictly prohibited for point balances. Calculations and validations route through `decimal.utils.js`. Database fields exclusively use `mongoose.Schema.Types.Decimal128`.
- **Response Shape:** Every endpoint will return `{ success: true/false, data: ... }` formatted via `serializeDocument()`. Errors uniformly return `{ success: false, message: "...", code: "EXACT_CODE" }`.
- **Indexes:** Extensively followed the `Schema.md` designs for compound, TTL, and sparse indexes to optimize queries (like hot bounties, leaderboard, and user timelines).
- **Mongoose Configuration:** Model updates rely on native `{ timestamps: true }`. Explicit `.ref` tags are set on all ObjectIds used across collections to allow proper `.populate()` commands.
- **✅ CHUNK 3D (Bounty Board Task Lifecycle):** Implemented `claimTask`, `submitTask`, and `approveTask`. Integrated MongoDB native sessions and transactions for atomic point transfers, inventory updates, and AuditLog boundary checks. Fully fixed JWT payload to support nested schema validation (`createdBy.name`).
\n- **✅ CHUNK 3E (Admin Course Approval Transaction & Routing):** Implemented atomic Mongoose multi-document transactions in `approveCourseRequest` for point deduction, inventory updates, and DLI code allocation. Refactored routing structure to strictly decouple standard and admin routes via `src/routes/admin.routes.js`. Fully validated with exhaustive E2E tests.
\n- **✅ CHUNK 3F (Admin Read Operations):** Implemented `getPendingRequests` and `getUsersLeaderboard` administrative endpoints safely bound behind `requireAdmin` logic without double-routing prefix bugs.

- **✅ CHUNK 4A (Final Endpoints & E2E Stress Tests):** Implemented `/register` endpoint mapping initial `Decimal128` economy stats correctly. Implemented `bulkUploadCodes` with fault-tolerant MongoDB `insertMany({ ordered: false })` boundaries. Extended `tests/e2e.test.js` validating transaction lockups on insufficient points, duplicated emails, and suspended accounts.
- **✅ CHUNK 5A (Next.js Replatforming & Auth Integration):** Extracted the frontend into a standalone `frontend-temp` repo, transitioned from SPA pattern to full Next.js App Router (`/login`, `/dashboard`, `/catalogue`, etc.), configured `.gitignore` properly to track node_modules and .next correctly. Hooked up `/login` authentication flowing to `localStorage` JWT setup.
- **✅ CHUNK 5B (Dashboard & Catalogue UI Hydration):** Wired the Express/Mongoose backend endpoints through `apiClient.ts`. Connected `DashboardView` mapping raw data to the Dashboard metrics, and fully connected `CatalogueView` to render dynamic course listings with dynamic "Out of Stock" mechanisms and request capabilities.
- **✅ CHUNK 5C (Bounty Board Tasks System):** Built the `BountyBoardView` utilizing Shadcn/Lucide elements to match Figma designs. Configured network state fetching `get('/tasks')` separating standard and hot bounties. Processed endpoints for `claimTask` and `submitTask` logic right in the UI.
- **✅ CHUNK 5D (Admin Approval Queue):** Engineered `PointApprovalQueueView` strictly matching UI styling utilizing Tailwind inline elements. Sourced `get('/admin/requests/pending')` and created real-time UI filtration functionality upon `handleAction` requests triggering the `patch('/admin/requests/:id')` backend route.
