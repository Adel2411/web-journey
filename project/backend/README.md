CollabNote Backend API :

Features :
- Express.js backend for CollabNote
- CRUD operations for notes
- Connected to MySQL using Prisma
- CORS-enabled for frontend
- Environment variable support


Endpoints :

| Method | Route            | Description        |
|--------|------------------|--------------------|
| GET    | /api/notes       | Get all notes      |
| POST   | /api/notes       | Create new note    |
| GET    | /api/notes/:id   | Get single note    |
| PUT    | /api/notes/:id   | Update a note      |
| DELETE | /api/notes/:id   | Delete a note      |