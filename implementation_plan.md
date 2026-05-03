# Team Task Management Web Application

## Goal Description
Design and develop a real-world, full-stack collaborative application to manage projects, tasks, and teams. The application will feature secure user authentication, role-based access control (Admin vs. Member), an interactive dashboard, and a stunning, responsive user interface built without utility CSS frameworks. The final application will be deployed to Railway.

## User Review Required
> [!IMPORTANT]
> The chosen tech stack is **React (Vite) + Vanilla CSS** for the frontend, and **Node.js + Express + Prisma (PostgreSQL)** for the backend. I have opted for Vanilla CSS to ensure maximum flexibility and to adhere to the instruction of avoiding TailwindCSS unless requested, while still delivering a highly premium and dynamic design.

> [!WARNING]
> Deployment requires access to your Railway account. The backend will need a PostgreSQL database instance provisioned on Railway. We will handle this step at the end.

## Open Questions
> [!CAUTION]
> Please clarify the following before we begin execution:
1. **Roles Scope:** The requirements state "Each user should have a role (Admin or Member)" and "Create projects (creator becomes Admin)". Should roles be **Project-Specific** (e.g., User A is an Admin in Project 1, but a Member in Project 2) or **Global** (e.g., User A is a system-wide Admin)? Project-specific roles are more standard for these tools, but let me know your preference.
2. **Database:** I am proposing PostgreSQL managed via Prisma ORM as it handles relations (Users, Projects, Tasks) excellently and is natively supported by Railway. Is PostgreSQL acceptable?
3. **Deployment Credentials:** Do you already have a Railway account set up, and are you comfortable linking your GitHub repository to Railway or using the Railway CLI?

## Proposed Architecture & Stack
- **Frontend:** React (bootstrapped with Vite), React Router, Context API for state management, Vanilla CSS for rich aesthetics (modern typography, gradients, glassmorphism).
- **Backend:** Node.js, Express.js.
- **Database:** PostgreSQL with Prisma ORM.
- **Authentication:** JSON Web Tokens (JWT) stored in HTTP-only cookies or local storage.

## Proposed Changes

### Backend Setup (Node.js/Express)
- **Initialize Express app** in a `backend/` directory.
- **Prisma Schema (`schema.prisma`):**
  - `User`: id, name, email, passwordHash.
  - `Project`: id, name, description, createdAt.
  - `ProjectMember`: userId, projectId, role (ADMIN | MEMBER).
  - `Task`: id, title, description, dueDate, priority, status, projectId, assignedToId.
- **API Endpoints:**
  - `POST /api/auth/signup`, `POST /api/auth/login`
  - `GET /api/projects`, `POST /api/projects`
  - `POST /api/projects/:id/members` (Admin only)
  - `GET /api/projects/:id/tasks`, `POST /api/projects/:id/tasks`, `PUT /api/tasks/:taskId` (Status/Assignee updates)
  - `GET /api/dashboard` (Stats aggregation)
- **Middleware:** JWT verification, Role authorization checks.

---

### Frontend Setup (Vite/React)
- **Initialize Vite app** in a `frontend/` directory.
- **Routing:**
  - `/login`, `/signup`
  - `/` (Dashboard)
  - `/projects` (List of projects)
  - `/projects/:id` (Kanban-style task board and member list)
- **Design System (`index.css`):**
  - Implement a premium design system using CSS variables.
  - High-end dark mode aesthetics, smooth hover transitions, and micro-animations for task cards.
- **Components:**
  - `Navbar`, `Sidebar`, `TaskCard`, `CreateTaskModal`, `ProjectList`.

---

### Deployment Configuration
- Root `package.json` with scripts for Railway deployment.
- `railway.json` or equivalent configuration to define build and start commands.
- Configuration to serve the Vite frontend build through the Express backend, or deploy them as two separate Railway services (I recommend a unified deployment for simplicity if preferable, or separate services for scalability).

## Verification Plan
### Automated Tests
- Validate Prisma schema relations and generate the local SQLite/PostgreSQL client.
- Test backend API routes using local automated requests or a REST client setup to ensure correct JWT validation and role constraints.

### Manual Verification
- Run the full stack locally (`npm run dev` for both frontend and backend).
- Create a test user, log in, create a project (verify Admin status), add a task, assign it, and update its status.
- Add a second user, invite them to the project, and verify they cannot add members but can update their assigned tasks.
- Verify the Dashboard accurately displays aggregated metrics.
- Deploy to Railway and manually verify functionality on the public URL.
