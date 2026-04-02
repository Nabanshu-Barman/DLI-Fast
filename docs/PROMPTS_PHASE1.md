# Phase 1 Prompts — Copy-Paste into GitHub Copilot Chat

> Open Copilot Chat (Ctrl+Shift+I), attach the relevant file, paste the prompt.
> After each chunk: test it, then run: git add . && git commit -m "phase1: <what you built>"
> Then update MEMORY.md before the next chunk.

---

## CHUNK 1A — Project Init + Server

**Files to attach:** `docs/REQUIREMENTS.md`, `.github/copilot-instructions.md`

**Prompt:**
```
Read the attached REQUIREMENTS.md and copilot-instructions.md.

Initialize a Node.js backend project for the DLI Fast platform.

Tasks:
1. Generate package.json with these exact dependencies:
   express, mongoose, dotenv, jsonwebtoken, bcryptjs,
   express-validator, helmet, express-rate-limit

2. Generate src/server.js that:
   - Loads dotenv
   - Connects to MongoDB via Mongoose using process.env.MONGODB_URI
   - Crashes the process with a clear error message if MONGODB_URI is not set or connection fails
   - Applies helmet() globally before any routes
   - Applies a global rate limiter (100 requests per 15 minutes)
   - Applies express.json() middleware
   - Starts listening on process.env.PORT (default 3000)
   - Logs "Server running on port X" and "MongoDB connected" on success

3. Generate .env.example with the canonical env var names (no real values).

Constraints:
- JSDoc on all functions
- No tutorial-style comments — explain the WHY
- Do not generate any routes or models yet
```

---

## CHUNK 1B — Utility Files

**Files to attach:** `.github/copilot-instructions.md`

**Prompt:**
```
Read the attached copilot-instructions.md.

Generate two utility files for the DLI Fast backend:

FILE 1: src/utils/decimal.utils.js
Generate these exported functions:
- toDecimal128(value) → converts a Number or string to mongoose Decimal128
- fromDecimal128(decimal) → converts Decimal128 to a plain JS Number for math
- addDecimal(a, b) → adds two Decimal128 values, returns Decimal128
- subtractDecimal(a, b) → subtracts b from a (Decimal128), returns Decimal128
- isNegative(decimal) → returns true if Decimal128 value < 0

These functions must handle the conversion via mongoose.Types.Decimal128.fromString().
They exist because raw JS floating-point arithmetic is banned for point balances.

FILE 2: src/utils/serialize.js
Generate an exported serializeDocument(doc) function that:
- Accepts a Mongoose document or plain object (handles both .toObject() and raw objects)
- Recursively converts all ObjectId fields → String
- Recursively converts all Decimal128 fields → Number
- Recursively converts all Date fields → ISO string
- Returns a plain JSON-safe object
- Must handle nested objects and arrays

JSDoc on every function. Explain architectural reasons in comments.
```

---

## CHUNK 1C — Mongoose Models (Batch 1: User, Course, CourseRequest)

**Files to attach:** `Schema.md`, `.github/copilot-instructions.md`

**Prompt:**
```
Read the attached Schema.md and copilot-instructions.md.

Generate Mongoose models for 3 collections. Place each in src/models/.

MODEL 1: src/models/User.js (maps to `users` collection)
MODEL 2: src/models/Course.js (maps to `courses` collection)  
MODEL 3: src/models/CourseRequest.js (maps to `courserequests` collection)

Hard constraints for all models:
- Every field marked Decimal128 in Schema.md MUST use mongoose.Schema.Types.Decimal128
- Every ObjectId with an ext-ref MUST include the correct ref: attribute
- Use { timestamps: true } — never manually define createdAt/updatedAt
- Implement ALL indexes from the Schema.md index tables using schema.index({})
- TTL indexes are NOT required for these three collections
- Implement ALL enum arrays exactly as written in Schema.md
- Implement default values where Schema.md indicates (e.g. isBanned: false, isActive: true)

Do NOT generate controllers, routes, or any other files.
```

---

## CHUNK 1D — Mongoose Models (Batch 2: Task, AuditLog, DliCode, Notification, Webhook, Project)

**Files to attach:** `Schema.md`, `.github/copilot-instructions.md`

**Prompt:**
```
Read the attached Schema.md and copilot-instructions.md.

Generate Mongoose models for the remaining 6 collections:

- src/models/Task.js (maps to `tasks` collection)
- src/models/AuditLog.js (maps to `auditlogs` collection)
- src/models/DliCode.js (maps to `dli_codes` collection)
- src/models/Notification.js (maps to `notifications` collection)
- src/models/Webhook.js (maps to `webhooks` collection)
- src/models/Project.js (maps to `projects` collection)

CRITICAL for AuditLog and Notification:
TTL indexes ARE mandatory. Use this pattern:
  auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }) // 90 days
  notificationSchema.index({ sentAt: 1 }, { expireAfterSeconds: 2592000 }) // 30 days

All other constraints are same as previous batch — Decimal128, ext-refs with ref:, timestamps: true,
all enums exact, all indexes from Schema.md.

Do NOT generate controllers, routes, or any other files.
```

---

## AFTER PHASE 1 — Verification Checklist

Before moving to Phase 2 (Auth), verify:

- [ ] `node src/server.js` starts without errors (MongoDB connected message appears)
- [ ] Mongoose connection actually connects to Atlas (check Atlas dashboard for connection)
- [ ] `src/utils/decimal.utils.js` exists with all 5 functions
- [ ] `src/utils/serialize.js` exists and handles nested objects
- [ ] All 9 model files exist in `src/models/`
- [ ] No Mongoose deprecation warnings in console

Once all pass: `git add . && git commit -m "phase1: complete — server, utils, all 9 models"`
Then update MEMORY.md Phase Tracker.
