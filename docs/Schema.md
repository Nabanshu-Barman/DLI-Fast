# MongoDB Schema v2 (Production)

> JSON structural mapping for the bounty board platform.
> No Mongoose code. No controllers. Collections and data types only.




---

## Collections

---

### 1. `users`

```json
{
  "_id":                  "ObjectId",
  "srmRegNo":             "String",           // UNIQUE INDEX
  "name":                 "String",
  "email":                "String",           // UNIQUE INDEX
  "passwordHash":         "String",
  "avatarUrl":            "String | null",
  "role":                 "Enum",             // ["member", "admin"]

  "subRoles": [                               // scoped permissions per project (only for members)
    {
      "projectId":        "ObjectId",         // ext-ref → projects
      "role":             "Enum"              // ["project_lead", "mentor"]
                                              // project_lead can approve tasks and assign points within this project only
                                              // mentor can approve tasks within this project only
    }
  ],                                          // empty array = standard member with no elevated permissions

  "points": {
    "balance":            "Decimal128",       // spendable (can go negative)
    "totalEarned":        "Decimal128",       // lifetime earned
    "totalSpent":         "Decimal128",       // lifetime spent
    "negativeAccrued":    "Decimal128"        // cumulative penalties
  },

  "activeCourse": {                           // ext-ref → courses, null when idle
    "_id":                "ObjectId | null",
    "title":              "String | null",
    "pointsRequired":     "Decimal128 | null"
  },

  "rank":                 "Enum",             // ["Rookie", "Contributor", "Expert", "Elite"]
  "coursesCompletedCount":"Number",           // integer count

  "isBanned":             "Boolean",          // default false — account permanently disabled
  "isSuspended":          "Boolean",          // default false — temporary restriction
  "lastLoginAt":          "Date",
  "githubUsername":       "String | null",

  "notificationPrefs": {
    "email":              "Boolean",
    "discord":            "Boolean",
    "slack":              "Boolean"
  },

  "createdAt":            "Date",
  "updatedAt":            "Date"
}
```

| Index | Type | Purpose |
|---|---|---|
| `srmRegNo` | Unique | Primary user lookup |
| `email` | Unique | Auth & admin search |
| `points.balance` | Desc | Leaderboard |
| `subRoles.projectId` | Regular | Scoped permission queries by project |

No embedded arrays except `subRoles` — `points`, `activeCourse`, and `notificationPrefs` are fixed-shape sub-documents.

---

### 2. `courses`

```json
{
  "_id":                  "ObjectId",
  "title":                "String",
  "description":          "String",
  "pointsRequired":       "Decimal128",
  "imageUrl":             "String",
  "category":             "String",           // "Deep Learning", "Robotics", "HPC", etc. (open-ended)
  "level":                "Enum",             // ["Beginner", "Intermediate", "Advanced"]
  "provider":             "String",           // "NVIDIA DLI", "Coursera", etc.
  "inventoryCount":       "Number",           // integer count — available codes remaining
  "isActive":             "Boolean",
  "createdAt":            "Date",
  "updatedAt":            "Date"
}
```

| Index | Type | Purpose |
|---|---|---|
| `isActive` + `category` + `level` | Compound | Catalogue filtering by category and difficulty |
| `pointsRequired` | Asc | Sort by cost |

Actual redemption codes live in a separate `dli_codes` collection (1-to-1 mapping). `inventoryCount` is decremented atomically on approval.

---

### 3. `tasks` (Bounty Board)

```json
{
  "_id":                  "ObjectId",
  "title":                "String",
  "description":          "String",
  "category":             "Enum",             // ["Frontend", "ML", "DevOps", "Content"]

  "points": {
    "base":               "Decimal128",
    "multiplier":         "Decimal128",       // 1.0 normal, 1.5/2.0 hot bounty
    "effective":          "Decimal128"        // base × multiplier (pre-computed)
  },

  "isHotBounty":          "Boolean",

  "status":               "Enum",             // ["open", "claimed", "in_review", "completed", "expired"]
  "priority":             "Enum",             // ["low", "medium", "high", "critical"]
  "difficulty":           "Enum",             // ["beginner", "intermediate", "advanced"]

  "deadline":             "Date | null",

  "tags":                 "[String]",         // default empty array, member dashboard filtering
  "projectId":            "ObjectId | null",  // ext-ref → projects, filter-by-project
  "githubIssueRef":       "String | null",    // GitHub issue URL, auto-populated via webhook

  "createdBy": {                              // ext-ref → users
    "_id":                "ObjectId",
    "name":               "String",
    "srmRegNo":           "String"
  },

  "claimedBy": {                              // ext-ref → users, null when unclaimed
    "_id":                "ObjectId | null",
    "name":               "String | null",
    "srmRegNo":           "String | null",
    "claimedAt":          "Date | null"
  },

  "submissionDetails": {                      // proof of work
    "url":                "String | null",
    "comment":            "String | null",
    "submittedAt":        "Date | null"
  },

  "transferRequest": {                        // peer-to-peer hand-off
    "proposedAssigneeId": "ObjectId | null",
    "status":             "Enum | null"       // ["pending", "accepted", "rejected"]
  },

  "completedAt":          "Date | null",
  "reviewedBy": {                             // ext-ref → users
    "_id":                "ObjectId | null",
    "name":               "String | null"
  },

  "penaltyApplied":       "Boolean",
  "penaltyPoints":        "Decimal128",       // negative points deducted (0 if none)

  "createdAt":            "Date",
  "updatedAt":            "Date"
}
```

| Index | Type | Purpose |
|---|---|---|
| `status` | Regular | Filter open/claimed |
| `claimedBy._id` | Regular | "My Tasks" query |
| `isHotBounty` + `status` | Compound | Hot Bounties feed |
| `deadline` | Asc | Expiration sweep |
| `points.effective` | Desc | Sort by reward |
| `transferRequest.proposedAssigneeId` | Sparse | Transfer lookups |
| `transferRequest.status` | Sparse | Transfer status filtering |

**Hot Bounties:** `multiplier` > 1.0 when `isHotBounty` is true. `effective` is pre-computed so queries never need runtime math.

**Missed Deadlines:** When a claimed task passes `deadline`, a cron job sets `penaltyApplied: true`, records `penaltyPoints`, subtracts from `users.points.balance`, adds to `users.points.negativeAccrued`, and writes an audit log entry.

---

### 4. `courserequests`

```json
{
  "_id":                  "ObjectId",

  "requestedBy": {                            // ext-ref → users
    "_id":                "ObjectId",
    "name":               "String",
    "email":              "String",
    "srmRegNo":           "String"
  },

  "course": {                                 // ext-ref → courses
    "_id":                "ObjectId",
    "title":              "String",
    "pointsRequired":     "Decimal128"
  },

  "userBalanceAtRequest": "Decimal128",       // snapshot at time of request
  "status":               "Enum",             // ["pending", "approved", "rejected"]

  "redemptionCode":       "String | null",    // populated on approval
  "adminNote":            "String | null",

  "processedBy": {                            // ext-ref → users, null while pending
    "_id":                "ObjectId | null",
    "name":               "String | null"
  },

  "requestedAt":          "Date",
  "processedAt":          "Date | null",

  "createdAt":            "Date",
  "updatedAt":            "Date"
}
```

| Index | Type | Purpose |
|---|---|---|
| `requestedBy._id` + `status` | Compound | Member dashboard |
| `status` | Regular | Admin pending queue |
| `course._id` | Regular | Most-requested analytics |

---

### 5. `auditlogs`

```json
{
  "_id":                  "ObjectId",

  "action":               "Enum",             // ["POINTS_EARNED", "POINTS_SPENT", "POINTS_ISSUED",
                                              //  "PENALTY_APPLIED", "TASK_CLAIMED", "TASK_COMPLETED",
                                              //  "TASK_TRANSFER_REQUESTED", "TASK_TRANSFER_ACCEPTED", "TASK_TRANSFER_REJECTED",
                                              //  "COURSE_REQUESTED", "COURSE_APPROVED", "COURSE_REJECTED",
                                              //  "USER_CREATED", "ROLE_CHANGED", "SUBROLE_CHANGED",
                                              //  "USER_BANNED", "USER_UNBANNED", "USER_SUSPENDED", "USER_UNSUSPENDED"]

  "target":                   "ObjectId",             // ext-ref → users

  "actor": {                                  // ext-ref → users, null = system/cron
    "_id":                "ObjectId | null",
    "role":               "String | null"
  },

  "metadata": {
    "taskId":             "ObjectId | null",
    "courseId":           "ObjectId | null",
    "courseRequestId":    "ObjectId | null",
    "webhookId":          "ObjectId | null",  // ext-ref → webhooks, for tracing auto-approved points
    "pointsDelta":        "Decimal128 | null",
    "multiplierUsed":     "Decimal128 | null",
    "reason":             "String | null",    // covers ban/suspend reason
    "previousBalance":    "Decimal128 | null",
    "newBalance":         "Decimal128 | null",
    "previousStatus":     "String | null",    // snapshot of isBanned/isSuspended before the action
    "newStatus":          "String | null"     // value after the action
  },

  "timestamp":            "Date"
}
```

| Index | Type | Purpose |
|---|---|---|
| `target` + `timestamp` | Compound (desc) | User activity timeline |
| `action` + `timestamp` | Compound (desc) | Filter by event type |
| `timestamp` | Desc | Global feed |
| `timestamp` | TTL (Mandatory) | Auto-purge after N days |

---

### 6. `dli_codes`

```json
{
  "_id":                  "ObjectId",
  "courseId":             "ObjectId",         // ext-ref → courses
  "code":                 "String",           // UNIQUE INDEX
  "isUsed":               "Boolean",          // default false
  "usedBy":               "ObjectId | null",  // ext-ref → users
  "usedAt":               "Date | null",
  "createdAt":            "Date"
}
```

| Index | Type | Purpose |
|---|---|---|
| `code` | Unique | Code lookup & redemption |
| `courseId` + `isUsed` | Compound | Available codes query |

---

### 7. `webhooks`

```json
{
  "_id":                  "ObjectId",
  "repoUrl":              "String",
  "branch":               "String",
  "secret":               "String",
  "isActive":             "Boolean",

  "triggerOn":            "Enum",             // ["pr_merged", "issue_closed"]

  "pointMapping": {
    "taskCategory":       "String | null",    // maps merged PR to this task category e.g. "Frontend", "ML"
    "basePoints":         "Decimal128 | null",// points awarded on trigger, null = admin reviews manually
    "autoApprove":        "Boolean"           // if true, points are awarded automatically on trigger
                                              // if false, webhook creates a pending task submission for admin review
  },

  "createdBy": {                              // ext-ref → users
    "_id":                "ObjectId",
    "name":               "String"
  },

  "createdAt":            "Date",
  "updatedAt":            "Date"
}
```

| Index | Type | Purpose |
|---|---|---|
| `repoUrl` + `branch` | Compound (unique) | Webhook lookup per repo/branch |

---

### 8. `notifications`

```json
{
  "_id":                  "ObjectId",
  "userId":               "ObjectId",         // ext-ref → users
  "type":                 "Enum",             // ["DEADLINE_REMINDER", "HOT_BOUNTY", "POINTS_APPROVED", "TASK_TRANSFER", "COURSE_APPROVED"]
  "channel":              "Enum",             // ["email", "discord", "slack"]
  "message":              "String",

  "metadata": {                               // allows frontend deep-link to relevant task or course
    "taskId":             "ObjectId | null",
    "courseId":           "ObjectId | null"
  },

  "isRead":               "Boolean",          // default false
  "sentAt":               "Date"
}
```

| Index | Type | Purpose |
|---|---|---|
| `userId` + `isRead` | Compound | User notification inbox |
| `sentAt` | TTL (Mandatory) | Auto-purge old notifications |

---

### 9. `projects`

```json
{
  "_id":                  "ObjectId",
  "name":                 "String",
  "description":          "String | null",
  "repoUrl":              "String | null",    // GitHub repository URL

  "lead": {                                   // ext-ref → users, the project_lead for this project
    "_id":                "ObjectId",
    "name":               "String",
    "srmRegNo":           "String"
  },

  "members": [                                // ext-ref → users, team members (roles defined in users.subRoles)
    {
      "_id":              "ObjectId",
      "name":             "String",
      "srmRegNo":         "String"
    }
  ],

  "isActive":             "Boolean",          // default true
  "createdAt":            "Date",
  "updatedAt":            "Date"
}
```

| Index | Type | Purpose |
|---|---|---|
| `name` | Unique | Project lookup |
| `lead._id` | Regular | Projects by lead |
| `members._id` | Regular | Projects by member |
| `isActive` | Regular | Active project filtering |

**Sub-role scope:** Permissions are defined in `users.subRoles[]` where each entry maps a `projectId` to a role (`project_lead` or `mentor`). RBAC middleware queries `users.subRoles` to check if the user has elevated permissions for tasks where `tasks.projectId` matches.

---

