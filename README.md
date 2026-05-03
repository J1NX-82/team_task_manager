# Team Task Management Application

A full-stack collaborative application built to manage projects, tasks, and teams efficiently. This project demonstrates core competencies in frontend design, backend architecture, database modeling, and role-based access control.

## 🚀 Features

### 1. Secure User Authentication
- Complete Signup and Login flow.
- Stateless, secure JWT (JSON Web Token) based authentication.
- Passwords cryptographically hashed using `bcryptjs`.

### 2. Role-Based Access Control (RBAC)
- **Admin:** The first registered user is automatically promoted to Admin. Admins have system-wide privileges to manage projects, tasks, and members.
- **Member:** Standard users who can only view assigned projects and update the statuses of tasks assigned to them.

### 3. Project & Team Management
- Admins can create new projects and add registered users to them as members.
- Members have isolated views and can only interact with projects they belong to.

### 4. Interactive Task Kanban Board
- Create tasks with a Title, Description, Due Date, and Priority.
- Assign tasks to specific project members.
- Update task statuses (`To Do`, `In Progress`, `Done`) via a dynamic Kanban interface.

### 5. Analytics Dashboard
- Track KPIs including Total Tasks, Tasks by Status, Overdue Tasks.
- Admins receive a granular breakdown of tasks assigned per user across the platform.

### 6. Premium UI Design
- Custom-built, utility-free CSS design system.
- Modern aesthetics featuring dark mode, glassmorphism, responsive grids, and subtle micro-animations.

---

## 💻 Technology Stack

**Frontend:**
- React.js (Bootstrapped with Vite)
- React Router DOM for routing
- Axios for API communication
- Context API for state management
- Lucide React for iconography
- Vanilla CSS

**Backend:**
- Node.js & Express.js
- Prisma ORM
- PostgreSQL (Production) / SQLite (Local Development)
- JSON Web Tokens (JWT)

---

## 🛠️ Local Development Setup

To run this application locally, ensure you have Node.js installed.

1. **Install Dependencies:**
   Navigate to the root directory and run:
   ```bash
   npm run install:all
   ```
2. **Start the Application:**
   Run the following command from the root directory to generate the database, build the frontend, and start the local server:
   ```bash
   npm run build
   npm start
   ```
3. **Access the App:**
   Open your browser and navigate to `http://localhost:5000`.

---

## ☁️ Deployment (Railway)

This repository is pre-configured for a unified deployment to Railway.
1. Update `backend/prisma/schema.prisma` to use the `postgresql` provider.
2. Push this repository to GitHub and connect it to a new Railway project.
3. Provision a PostgreSQL database within Railway.
4. Add the `DATABASE_URL` and `JWT_SECRET` environment variables.
Railway will automatically execute the build scripts and serve both the API and the static React frontend from a single service!

---

> **Note on AI Usage:** 
> Generative AI tools were utilized in this project strictly as an advanced autocomplete and reference tool. AI assisted primarily with boilerplate generation, basic environmental setup, and syntax referencing. All core architectural decisions, database relational mapping, role-based logic implementation, and custom UI design were conceptualized and manually orchestrated by the developer to ensure a robust and custom-tailored solution.
