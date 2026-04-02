# Copilot Instructions — DLI Fast Backend

## Stack

- Node.js + Express + Mongoose + MongoDB Atlas
- Auth: `jsonwebtoken` (env var: `JWT_ACCESS_SECRET` only — never `JWT_SECRET`)
- Security: `helmet`, `express-rate-limit`, `express-validator`, `bcryptjs`
- All point/balance fields: `mongoose.Schema.Types.Decimal128` via `src/utils/decimal.utils.js`
- All API responses pass through `serializeDocument` from `src/utils/serialize.js`

## Response shape (every endpoint, no exceptions)

```js
// Success
res.status(200).json({ success: true, data: payload });
// Error
res.status(4xx).json({ success: false, message: "...", code: "SCREAMING_SNAKE" });
```

## File conventions

- `src/models/` — one Mongoose model per collection
- `src/controllers/` — business logic only, no inline route definitions
- `src/routes/` — Express routers only, no logic
- `src/middleware/auth.middleware.js` — exports `verifyToken`, `requireAdmin`
- `src/middleware/validate.js` — exports `validateRequest` (express-validator wrapper)
- `src/utils/decimal.utils.js` — exports `toDecimal128`, `fromDecimal128`, `addDecimal`, `subtractDecimal`
- `src/utils/serialize.js` — exports `serializeDocument`

## Mongoose schema rules

- Always use `{ timestamps: true }` — never define `createdAt`/`updatedAt` manually
- Every `ObjectId` ext-ref field must have the correct `ref:` value
- Every enum must exactly match Schema.md
- All indexes defined at schema level via `schema.index({})`
- TTL indexes mandatory on `auditlogs` (90 days) and `notifications` (30 days)

## Transaction rule

Any endpoint that modifies `points` AND `inventory` simultaneously must use:

```js
const session = await mongoose.startSession();
session.startTransaction();
try {
  /* ... */ await session.commitTransaction();
} catch (e) {
  await session.abortTransaction();
  throw e;
} finally {
  session.endSession();
}
```

## Comment style — this is non-negotiable

### Banned (tutorial-style) — never write these:

```js
// find user by id
// check if user exists
// return the result
// connect to the database
// hash the password
// create a new instance
```

### Required (production-style) — always write these:

```js
/**
 * Snapshots userBalanceAtRequest at submission time rather than approval time
 * to prevent a race condition where a concurrent approval drains the balance
 * between request creation and admin review.
 *
 * @param {string} userId - Requesting user's ObjectId string
 * @param {string} courseId - Target course's ObjectId string
 * @returns {Promise<CourseRequest>}
 * @throws {409} DUPLICATE_PENDING_REQUEST — one active request per course per user
 * @throws {409} INSUFFICIENT_POINTS — balance below pointsRequired at submission time
 */
```

### Inline comments explain WHY, not WHAT:

```js
// Bad:
const hash = await bcrypt.hash(password, 12); // hash the password

// Good:
const hash = await bcrypt.hash(password, 12); // cost factor 12: ~250ms on commodity hardware, acceptable UX tradeoff vs brute-force resistance
```

## Git Commit Style

- All commit messages must follow the Conventional Commits specification.
- Use prefixes like `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`, `test:`, `perf:`, `ci:`, `build:`, or `revert:`.
- Example: `feat: add user authentication middleware`
- Example: `chore: update phase 1 documentation`

## What NOT to generate

- No `console.log` left in controllers (use structured error throws)
- No `catch (e) { console.error(e) }` — always re-throw or return a proper error response
- No `JWT_SECRET` — only `JWT_ACCESS_SECRET`
- No `Number` type for any field that touches points or balances
- No Mongoose model without indexes
- No route without a `validateRequest` middleware call
- No stack traces in responses (`process.env.NODE_ENV === 'production'` guard required on all 500 handlers)
