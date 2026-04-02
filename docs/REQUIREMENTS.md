# DLI Fast — Consolidated Requirements Reference

> Synthesized from: FAST Club PDF brief + backend.md + Schema.md
> This file is read-only context for AI sessions. Do not prompt Copilot to modify it.

---

## 1. WHAT WE'RE BUILDING

An internal MERN stack web app for the FAST Club to:
- Distribute NVIDIA DLI course access codes to members.
- Track a virtual point economy (earn via bounty tasks, spend on course codes).
- Let admins manage course inventory and approve/reject redemption requests.

**User scale:** ~100 concurrent users max.  
**Security level:** Production-grade (internal tool still handles real point economy and user data).

---

## 2. FEATURE PRIORITIES

### Priority 1 — Must ship first (Blocker for everything else)
| Feature | Endpoint | Who uses it |
|---|---|---|
| Member login | `POST /api/v1/auth/login` | Members + Admins |
| Admin login | Same endpoint, RBAC via role field | Admin |
| Course catalogue | `GET /api/v1/courses` | Members |

### Priority 2 — Core application logic
| Feature | Endpoint | Who uses it |
|---|---|---|
| User dashboard | `GET /api/v1/dashboard/me` | Members |
| Course request | `POST /api/v1/requests` | Members |
| Admin approval | `PATCH /api/v1/admin/requests/:id` | Admin |

### Priority 3 — Bounty board (full task lifecycle)
| Feature | Endpoint | Who uses it |
|---|---|---|
| View tasks | `GET /api/v1/tasks` | Members |
| Claim task | `POST /api/v1/tasks/:id/claim` | Members |
| Submit task | `POST /api/v1/tasks/:id/submit` | Members |
| Approve submission | `PATCH /api/v1/admin/tasks/:id/approve` | Admin / Project Lead |

---

## 3. DATA COLLECTIONS SUMMARY

| Collection | Purpose | Critical Fields |
|---|---|---|
| `users` | Members and admins | `points.balance` (Decimal128), `role`, `subRoles`, `activeCourse` |
| `courses` | DLI course catalogue | `pointsRequired` (Decimal128), `inventoryCount`, `isActive` |
| `tasks` | Bounty board tasks | `points.effective` (Decimal128), `status` enum, `claimedBy` |
| `courserequests` | Course redemption requests | `status` enum, `redemptionCode`, `userBalanceAtRequest` |
| `auditlogs` | Immutable event log | `action` enum (20 types), TTL index mandatory |
| `dli_codes` | Actual course access codes | `isUsed`, `courseId`, unique `code` field |
| `notifications` | User notifications | `userId`, `type` enum, TTL index mandatory |
| `webhooks` | GitHub webhook config | `repoUrl`+`branch` unique compound index |
| `projects` | Club projects / sub-roles | `lead`, `members[]`, scoped RBAC |

---

## 4. ADMIN APPROVAL TRANSACTION — STEP BY STEP

This is the most complex endpoint. It touches 5 collections atomically.

```
START TRANSACTION
  1. Find courseRequest by :id where status === "pending"           → 404 if not found
  2. Find course by courseRequest.course._id                        → 404 if not found
  3. Guard: course.inventoryCount > 0                               → 409 COURSE_OUT_OF_STOCK
  4. Find ONE dli_code where courseId matches AND isUsed === false   → 409 NO_CODES_AVAILABLE
  5. Guard: user.points.balance >= course.pointsRequired            → 409 INSUFFICIENT_POINTS
  6. Mark dli_code.isUsed = true, set usedBy, usedAt
  7. Set courseRequest.status = "approved", set redemptionCode, processedBy, processedAt
  8. Decrement course.inventoryCount by 1
  9. Update user.activeCourse (set _id, title, pointsRequired)
 10. Subtract course.pointsRequired from user.points.balance
     Add to user.points.totalSpent
 11. Write AuditLog entry (action: "COURSE_APPROVED")
COMMIT
```

---

## 5. MIDDLEWARE CHAIN REFERENCE

```
All routes:        helmet() → express-rate-limit (global)
Auth routes:       stricter rate limit (10 req/15min)
Member routes:     verifyToken → validateRequest → controller
Admin routes:      verifyToken → requireAdmin → validateRequest → controller
Sub-role routes:   verifyToken → requireSubRole(projectId, ['project_lead','mentor']) → controller
```

---

## 6. AUDIT LOG ACTION ENUM (ALL 20 TYPES)

```
POINTS_EARNED | POINTS_SPENT | POINTS_ISSUED | PENALTY_APPLIED
TASK_CLAIMED | TASK_COMPLETED | TASK_TRANSFER_REQUESTED | TASK_TRANSFER_ACCEPTED | TASK_TRANSFER_REJECTED
COURSE_REQUESTED | COURSE_APPROVED | COURSE_REJECTED
USER_CREATED | ROLE_CHANGED | SUBROLE_CHANGED
USER_BANNED | USER_UNBANNED | USER_SUSPENDED | USER_UNSUSPENDED
```

---

## 7. TASK STATUS STATE MACHINE

```
open → claimed (member claims it)
claimed → in_review (member submits proof)
in_review → completed (admin/project_lead approves → triggers POINTS_EARNED)
in_review → open (admin rejects → task re-opens)
open/claimed → expired (cron job hits deadline → triggers PENALTY_APPLIED if claimed)
claimed → claimed (transfer: proposed → accepted)
```

---

## 8. SECURITY CHECKLIST (PER ENDPOINT)

- [ ] `express-validator` chain defined and called via `validateRequest` middleware
- [ ] JWT verified via `verifyToken` middleware
- [ ] Role checked via `requireAdmin` or `requireMember`
- [ ] No stack traces in error responses
- [ ] No sensitive data in JWT payload (only `_id`, `role`, `srmRegNo`)
- [ ] Passwords never logged or returned
- [ ] All Decimal128 values serialized via `serializeDocument` before response

---

## 9. ENV FILE TEMPLATE (.env.example)

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/dli-fast
JWT_ACCESS_SECRET=<minimum-32-char-random-string>
```
