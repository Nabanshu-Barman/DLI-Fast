# API Endpoints Documentation - Course CRUD & DLI Codes

## Base URL
```
http://localhost:3000/api/v1
```

---

## COURSE ENDPOINTS

### 1. Get Courses Catalog (Public)
**Endpoint:** `GET /courses`

**Query Parameters:**
- `category` (optional): Filter by category (string)
- `level` (optional): Filter by level - Beginner, Intermediate, Advanced

**Response (200):**
```json
{
  "courses": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Deep Learning Fundamentals",
      "description": "Learn the basics of deep learning",
      "pointsRequired": 100.5,
      "imageUrl": "https://example.com/image.jpg",
      "category": "Deep Learning",
      "level": "Beginner",
      "provider": "NVIDIA DLI",
      "inventoryCount": 50,
      "isActive": true,
      "createdAt": "2026-04-02T10:00:00Z",
      "updatedAt": "2026-04-02T10:00:00Z"
    }
  ]
}
```

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/courses?category=Deep%20Learning&level=Beginner"
```

---

### 2. Create Course (Admin Only)
**Endpoint:** `POST /courses`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Body:**
```json
{
  "title": "Advanced Deep Learning",
  "description": "Master advanced deep learning concepts",
  "pointsRequired": 250.75,
  "imageUrl": "https://example.com/advanced.jpg",
  "category": "Deep Learning",
  "level": "Advanced",
  "provider": "NVIDIA DLI"
}
```

**Response (201):**
```json
{
  "message": "Course created successfully",
  "course": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Advanced Deep Learning",
    "description": "Master advanced deep learning concepts",
    "pointsRequired": 250.75,
    "imageUrl": "https://example.com/advanced.jpg",
    "category": "Deep Learning",
    "level": "Advanced",
    "provider": "NVIDIA DLI",
    "inventoryCount": 0,
    "isActive": true,
    "createdAt": "2026-04-02T10:00:00Z",
    "updatedAt": "2026-04-02T10:00:00Z"
  }
}
```

---

### 3. Update Course (Admin Only)
**Endpoint:** `PATCH /courses/:courseId`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Path Parameters:**
- `courseId`: MongoDB ObjectId (24 hex characters)

**Body (all fields optional):**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "pointsRequired": 300,
  "imageUrl": "https://example.com/new-image.jpg",
  "category": "Robotics",
  "level": "Intermediate",
  "provider": "Updated Provider",
  "isActive": false
}
```

**Response (200):**
```json
{
  "message": "Course updated successfully",
  "course": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Updated Title",
    "description": "Updated description",
    "pointsRequired": 300,
    "imageUrl": "https://example.com/new-image.jpg",
    "category": "Robotics",
    "level": "Intermediate",
    "provider": "Updated Provider",
    "inventoryCount": 25,
    "isActive": false,
    "createdAt": "2026-04-02T10:00:00Z",
    "updatedAt": "2026-04-02T11:00:00Z"
  }
}
```

---

### 4. Delete Course (Admin Only)
**Endpoint:** `DELETE /courses/:courseId`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Path Parameters:**
- `courseId`: MongoDB ObjectId (24 hex characters)

**Response (200):**
```json
{
  "message": "Course deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Course not found"
}
```

---

### 5. Get Available Codes Count for Course (Public)
**Endpoint:** `GET /courses/:courseId/available-codes`

**Path Parameters:**
- `courseId`: MongoDB ObjectId (24 hex characters)

**Response (200):**
```json
{
  "courseId": "507f1f77bcf86cd799439012",
  "availableCodesCount": 42
}
```

---

## DLI CODES ENDPOINTS

### 6. Bulk Upload DLI Codes (Admin Only)
**Endpoint:** `POST /courses/:courseId/codes/bulk-upload`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Path Parameters:**
- `courseId`: MongoDB ObjectId (24 hex characters)

**Body:**
```json
{
  "codes": [
    "DLI-CODE-001",
    "DLI-CODE-002",
    "DLI-CODE-003",
    "DLI-CODE-004",
    "DLI-CODE-005"
  ]
}
```

**Validation Rules:**
- `codes` must be a non-empty array
- Each code must be a non-empty string
- Maximum 10,000 codes per upload
- Course must exist

**Response (201):**
```json
{
  "message": "DLI codes uploaded successfully",
  "uploadedCount": 5,
  "courseId": "507f1f77bcf86cd799439012",
  "updatedInventoryCount": 50
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/v1/courses/507f1f77bcf86cd799439012/codes/bulk-upload" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "codes": [
      "DLI-CODE-001",
      "DLI-CODE-002",
      "DLI-CODE-003"
    ]
  }'
```

---

### 7. Get Available Codes Count (Public)
**Endpoint:** `GET /courses/:courseId/codes/available-count`

**Path Parameters:**
- `courseId`: MongoDB ObjectId (24 hex characters)

**Response (200):**
```json
{
  "courseId": "507f1f77bcf86cd799439012",
  "availableCodesCount": 42
}
```

---

### 8. Get Course Codes List (Admin Only)
**Endpoint:** `GET /courses/:courseId/codes/list`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Path Parameters:**
- `courseId`: MongoDB ObjectId (24 hex characters)

**Query Parameters:**
- `used` (optional): "true" or "false" to filter by used status
- `limit` (optional): Number of results per page, default 100, max 500
- `skip` (optional): Number of results to skip for pagination, default 0

**Response (200):**
```json
{
  "courseId": "507f1f77bcf86cd799439012",
  "codes": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "courseId": "507f1f77bcf86cd799439012",
      "code": "DLI-CODE-001",
      "isUsed": false,
      "usedBy": null,
      "usedAt": null,
      "createdAt": "2026-04-02T10:00:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "courseId": "507f1f77bcf86cd799439012",
      "code": "DLI-CODE-002",
      "isUsed": true,
      "usedBy": "507f1f77bcf86cd799439015",
      "usedAt": "2026-04-02T11:30:00Z",
      "createdAt": "2026-04-02T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 100,
    "skip": 0
  }
}
```

**Example Requests:**
```bash
# Get all available codes (not used)
curl "http://localhost:3000/api/v1/courses/507f1f77bcf86cd799439012/codes/list?used=false" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get all used codes with pagination
curl "http://localhost:3000/api/v1/courses/507f1f77bcf86cd799439012/codes/list?used=true&limit=20&skip=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## ERROR RESPONSES

### 400 - Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_enum_value",
      "expected": "Beginner | Intermediate | Advanced",
      "received": "Expert",
      "path": ["level"],
      "message": "Invalid enum value"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 - Forbidden
```json
{
  "error": "Forbidden"
}
```

### 404 - Not Found
```json
{
  "error": "Course not found"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## AUTHENTICATION

All admin-protected endpoints require:
1. Valid JWT token in `Authorization` header as `Bearer <token>`
2. User role must be "admin"

Token is obtained from: `POST /auth/login`

---

## SUMMARY OF IMPLEMENTED FEATURES

✅ **Course CRUD Operations:**
- Create courses (admin)
- Read courses with filters (public)
- Update courses (admin)
- Delete courses (admin)

✅ **DLI Codes Management:**
- Bulk upload codes to courses (supports up to 10,000 codes per request)
- Get available codes count per course (public)
- List all codes for a course with filters and pagination (admin)

✅ **Database Updates:**
- Automatically increments course `inventoryCount` when codes are uploaded
- Tracks code usage with `isUsed`, `usedBy`, and `usedAt` fields
- Maintains course `updatedAt` timestamp on modifications

---
