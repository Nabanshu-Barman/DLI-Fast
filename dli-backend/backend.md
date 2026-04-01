# Backend System Design and Implementation Guide

## 1. HARD TECHNICAL CONSTRAINTS
* **Native Driver Mandate:** Mongoose and all other ORMs/ODMs are strictly prohibited. All database interactions must use the official `mongodb` Node.js driver.
* **Schema Enforcement:** Collections must be initialized with `$jsonSchema` validation at the database level to ensure structural integrity.
* **Decimal128 Precision:** Standard JavaScript floating-point math is banned for point balances. Use only the utilities in `src/utils/decimal.utils.js`.
* **Object Serialization:** All responses must pass through the `serializeDocument` utility to correctly format `ObjectId` and `Date` types for the frontend.
* **JWT Naming:** `JWT_ACCESS_SECRET` is the canonical env var for signing and verifying tokens. `JWT_SECRET` must never be used.

## 2. CURRENT FEATURE VERIFICATION
* **Authentication:** `POST /api/v1/auth/login` (JWT issuance with RBAC).
* **Course Discovery:** `GET /api/v1/courses` (Native MongoDB find).
* **Dashboard:** `GET /api/v1/dashboard/me` (Aggregated user/request data).
* **Request Engine:** `POST /api/v1/requests` (Implemented).

## 3. REQUIRED IMPLEMENTATION: ADMIN WORKFLOWS
The Admin module is currently in a 'Placeholder' state.
**Approval Workflow (`PATCH /api/v1/admin/requests/:id`) Requirements:**
1. Start a MongoDB Session/Transaction (`session.startTransaction()`).
2. Retrieve an available code from `dli_codes` (`isUsed: false`).
3. Atomic update to mark code as `isUsed: true`.
4. Update `courserequests` status to approved.
5. Decrement `inventoryCount` in `courses`.
6. Update user's `activeCourse`.
7. Generate an entry in `auditlogs`.
8. Commit transaction or abort on any failure.

## 4. DOCUMENTATION OVERRIDE (CRITICAL)
* **README Error:** Section 6.3 of the root `README.md` contains an error suggesting the use of Mongoose. 
* **Source of Truth:** This `backend.md` file is the primary authoritative source for the backend technology stack and overrides all conflicting instructions in the `README.md`.

## 5. AUDIT LOG STANDARDS
Every entry in `auditlogs` must strictly follow this structure:
* `action`: (e.g., "COURSE_APPROVED", "POINTS_GRANTED")
* `actor`: `{ _id: "ObjectId", role: "admin" }`
* `target`: `"ObjectId"`
* `metadata`: `{ previousValue: "any", newValue: "any" }`
* `timestamp`: `"Date"`

**Field Conflict Resolution:** `actor` and `target` are the source of truth for auditlogs. `performedBy` and `targetUser` from Schema_v2.md are deprecated for this collection.

## 6. MIDDLEWARE & UTILITY CONTRACTS
* `verifyToken` → `src/middleware/auth.middleware.js`
* `requireAdmin` → `src/middleware/auth.middleware.js`
* `validateRequest` → `src/middleware/validate.js`
* `serializeDocument` → `src/utils/serialize.js`

## 7. LOCAL DEVELOPMENT SETUP
1. Switch to the correct branch: `git checkout feature/api-v1-core`
2. Navigate to the backend: `cd dli-backend`
3. Install dependencies: `npm install`
4. Copy the example env file: `cp .env.example .env`
5. Fill in `.env` — for `MONGODB_URI`, either use `mongodb://localhost:27017` if MongoDB is installed locally, or paste a MongoDB Atlas connection string.
6. Start the server: `node src/server.js`

**MongoDB Requirement:** Every developer must have one of the following:
- MongoDB installed locally (https://www.mongodb.com/try/download/community)
- A MongoDB Atlas free-tier cluster (https://cloud.mongodb.com)

Without a valid MONGODB_URI the server will crash on boot.
