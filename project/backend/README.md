## 📚 API Endpoints & Parameters with Validation

---

### 🔍 GET `/api/notes`

Retrieve a list of notes with optional search, pagination, and sorting.

**Query Parameters:**

- `search` (string, optional): Case-insensitive substring search in both `title` and `content`.
- `page` (number, optional, default = `1`): Page number (must be ≥ 1).
- `limit` (number, optional, default = `10`): Number of notes per page (reasonable range recommended).
- `sort` (string, optional, default = `"newest"`): Sort order. Acceptable values:
  - `"newest"` – Most recent notes first
  - `"oldest"` – Oldest notes first
  - `"az"` – Sort by title A–Z
  - `"za"` – Sort by title Z–A

**Validation:** No strict validation, but server enforces type conversion and fallback defaults.

---

### 📄 GET `/api/notes/:id`

Retrieve a single note by its numeric ID.

**Path Parameter:**

- `id` (number, required): Must be a valid integer. If not, the API responds with `400 Bad Request`.

**Validation:**

- Must be a valid number
- If the note doesn’t exist, returns `404 Not Found`

---

### ➕ POST `/api/notes`

Create a new note.

**Request Body Fields:**

- `title` (string, required): Must be:
  - **Not empty or just whitespace**
  - **At least 3 characters**
  - **Maximum 100 characters**
- `content` (string, required): Must be:
  - **Not empty or just whitespace**
  - **At least 10 characters**
  - **Maximum 5000 characters**
- `authorName` (string, optional): Optional free-form string
- `isPublic` (boolean, optional): Defaults to `true` if not provided

**Validation:**  
If `title` or `content` is missing, too short, too long, or only whitespace, the API will return `400 Bad Request` with a descriptive error message.

---

### ✏️ PUT `/api/notes/:id`

Update an existing note by ID. You can send **any combination** of fields.

**Path Parameter:**

- `id` (number, required): Must be a valid note ID

**Request Body Fields (at least one required):**

- `title` (string, optional): If provided, must be 3–100 characters
- `content` (string, optional): If provided, must be 10–5000 characters
- `authorName` (string, optional)
- `isPublic` (boolean, optional)

**Validation:**

- At least one field must be present
- Each field, if present, is validated like in `POST`
- If the note doesn’t exist, returns `404 Not Found`

---

### ❌ DELETE `/api/notes/:id`

Delete a note by its ID.

**Path Parameter:**

- `id` (number, required): Must be a valid note ID

**Validation:**

- If ID is not a number → `400 Bad Request`
- If note not found → `404 Not Found`
