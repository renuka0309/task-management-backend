# Task Management — Backend

A REST API built with NestJS, Prisma, and PostgreSQL (hosted on Neon), supporting the Task Management frontend.

## Live Demo
- **API base URL:** https://task-management-backend-production-5e7f.up.railway.app

Try it directly: `GET https://task-management-backend-production-5e7f.up.railway.app/tasks`

## Tech Stack
- NestJS
- TypeScript
- Prisma ORM (v5)
- PostgreSQL (hosted on Neon)
- class-validator / class-transformer for request validation

## Features Implemented

### Tasks (`/tasks`)
- Full CRUD: `GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PATCH /tasks/:id`, `DELETE /tasks/:id`
- Fields: title, description, status, priority, assignee, date, labels (JSON array), reporter, teams, projectId
- Auto-generates an Update log entry whenever a task's priority changes
- Request validation via DTOs (required fields enforced, extra/unrecognized fields stripped)

### Projects (`/projects`)
- Full CRUD: `GET /projects`, `GET /projects/:id`, `POST /projects`, `PATCH /projects/:id`, `DELETE /projects/:id`
- Fields: title, priority, lead, dueDate
- A project can have many tasks (`Task.projectId` references `Project.id`)

### Subtasks (`/tasks/:taskId/subtasks`)
- Nested under a specific task
- `GET`, `POST`, `PATCH /:id`, `DELETE /:id`
- Fields: task (title text), priority, member, dueDate

### Comments (`/tasks/:taskId/comments`)
- Nested under a specific task
- `GET`, `POST`, `DELETE /:id`
- Supports threaded replies via a self-referencing `parentCommentId` field

### Auth (`/auth/guest`)
- `POST /auth/guest` creates a guest user record and returns it
- No JWT or session token is issued — the frontend has no protected routes that require verifying a logged-in identity beyond the initial login screen, so a full token-based auth system was not implemented (see Known Limitations)

## Database Schema

See `prisma/schema.prisma` for full model definitions. Key relationships:
- `Project` has many `Task`
- `Task` has many `Subtask`, `Update`, `Comment`
- `Comment` supports self-referencing replies (`parentCommentId` → `Comment.id`)

**Design decisions worth noting:**
- `labels` is stored as a JSON string on the `Task` model rather than a separate join table. Postgres can support array columns, but a full `Label` entity with a many-to-many relation was judged to be more complexity than this feature needed at this scope.
- Originally built and tested against SQLite during development, then migrated to PostgreSQL (Neon) for deployment, since SQLite's file-based storage isn't reliable on most free-tier hosts with ephemeral filesystems.

## Known Limitations / Scope Decisions

- **No JWT/session-based authentication.** `POST /auth/guest` creates a user record but issues no token. Every endpoint is currently open (no auth guard), since the frontend doesn't have a concept of protected routes beyond the login screen itself. A production version of this app would add token issuance and route guards.
- **No rate limiting or advanced security middleware** — out of scope for this assessment.
- **Comment `author`** is a plain string field rather than a foreign key to a real authenticated `User` — consistent with the guest-only auth model above.
- **No automated tests were added beyond NestJS's default scaffolded test files** — manual testing was done via Postman for every endpoint during development.

## Getting Started (Local Development)

```bash
npm install
```

Create a `.env` file in the project root:
```
DATABASE_URL="your-postgresql-connection-string"
```

Generate the Prisma client and apply migrations:
```bash
npx prisma generate
npx prisma migrate deploy
```

Start the server:
```bash
npm run start:dev
```

API runs on `http://localhost:3001`.

## Deployment

Deployed on Railway.

**Build Command:**
```
npm install && npx prisma generate && npm run build
```

**Start Command:**
```
npm run start:prod
```

**Environment Variables (set in Railway dashboard):**
- `DATABASE_URL` — Neon PostgreSQL connection string

The server binds to `process.env.PORT` (falling back to `3001` locally) and listens on `0.0.0.0`, as required for containerized deployment platforms.

## Frontend Repository
[https://github.com/renuka0309/Task-Management.git]