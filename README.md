# TaskFlow — Setup Guide

A full-stack project & task tracking web app built with React + Supabase + Vercel.

---

## What You're Getting

- **Multi-project dashboard** — create as many projects as you need
- **Categories within each project** — organise tasks into groups
- **Full task management** — add, edit, delete tasks with rich fields
- **Status history timeline** — every update is logged with date & status
- **Export to Excel** — one click export of tasks + full history
- **User authentication** — secure login, each user sees only their own data
- **Works on any device** — responsive layout

---

## Step 1 — Set up Supabase (Free database + auth)

1. Go to [supabase.com](https://supabase.com) and click **Start for Free**
2. Sign up and click **New Project**
3. Enter a project name (e.g. `taskflow`), set a strong database password, choose a region close to you
4. Wait ~2 minutes for the project to spin up

### Run the database schema

5. In your Supabase project, click **SQL Editor** in the left sidebar
6. Click **New Query**
7. Open the file `supabase_schema.sql` from this folder and paste its entire contents into the editor
8. Click **Run** — you should see "Success. No rows returned"

### Get your API keys

9. Go to **Project Settings** → **API**
10. Copy:
    - **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
    - **anon / public** key (a long string starting with `eyJ...`)

---

## Step 2 — Deploy to Vercel (Free hosting)

### Option A — GitHub (Recommended)

1. Create a free account at [github.com](https://github.com)
2. Create a new repository called `taskflow`
3. Upload all the files in this folder to the repository (drag and drop in the GitHub UI, or use Git)
4. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
5. Click **Add New Project** → **Import** your `taskflow` repository
6. Vercel will auto-detect it as a React app — no changes needed
7. Before clicking Deploy, click **Environment Variables** and add:
   - `REACT_APP_SUPABASE_URL` → paste your Supabase Project URL
   - `REACT_APP_SUPABASE_ANON_KEY` → paste your Supabase anon key
8. Click **Deploy** — takes about 1 minute
9. Vercel gives you a live URL like `https://taskflow-abc123.vercel.app` 🎉

### Option B — Run locally first

```bash
# 1. Install Node.js from nodejs.org if you haven't already

# 2. Open a terminal in this folder and install dependencies
npm install

# 3. Create a .env file (copy from the template)
cp .env.example .env

# 4. Edit .env and paste your Supabase keys
# REACT_APP_SUPABASE_URL=https://xxxx.supabase.co
# REACT_APP_SUPABASE_ANON_KEY=eyJ...

# 5. Start the app
npm start
# Opens at http://localhost:3000
```

---

## Step 3 — Create your first account

1. Open your deployed app (or localhost:3000)
2. Click **Create Account**, enter your email and a password
3. Check your email for a confirmation link and click it
4. Sign in — you're in!

> **Tip:** If you don't want email confirmation, go to Supabase → **Authentication** → **Email** → disable "Confirm email"

---

## Using the App

### Projects
- From the home screen, click **+ New Project**
- Give it a name, description, and pick an icon/colour
- Click into a project to manage its tasks

### Categories
- Inside a project, click **+ Category** (top right) or use the sidebar
- Categories help organise tasks into groups (e.g. "API Testing", "Packaging", "FP Testing")

### Tasks
- Click **+ Add Task** to create a task
- Fields: Name, Description, Category, Status, Deadline, Assignee, Protocol Target, Activity Target
- Click any task row to expand it

### Status Updates
- Inside an expanded task, select a new status and type a note
- Press **Add Update** (or Ctrl+Enter) to log the update
- Every update is saved to the timeline with a timestamp
- Updates can be deleted individually

### Export
- Click **⬇ Export Excel** in the top bar of any project
- Downloads an .xlsx file with 3 sheets:
  - **Summary** — project overview stats
  - **Tasks** — all tasks with latest status
  - **Status History** — complete audit trail of all updates

---

## Folder Structure

```
taskflow/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Modal.js           # Reusable modal wrapper
│   │   ├── ProjectModal.js    # Create/edit project form
│   │   ├── TaskModal.js       # Create/edit task form
│   │   └── CategoryModal.js   # Create/edit category form
│   ├── context/
│   │   ├── AuthContext.js     # User authentication state
│   │   └── ToastContext.js    # Toast notification system
│   ├── lib/
│   │   ├── supabase.js        # All database operations
│   │   └── export.js          # Excel export logic
│   ├── pages/
│   │   ├── LoginPage.js       # Sign in / sign up
│   │   ├── HomePage.js        # All projects overview
│   │   └── ProjectPage.js     # Individual project + tasks
│   ├── App.js                 # Routing
│   ├── index.css              # All styles
│   └── index.js               # Entry point
├── supabase_schema.sql        # Run this in Supabase SQL Editor
├── vercel.json                # Vercel routing config
├── .env.example               # Environment variable template
└── package.json
```

---

## Customising

### Adding more status types
Edit `supabase_schema.sql` (the `check` constraint on `tasks.status`) and update `STATUS_LABELS` / `STATUS_CLASS` in `ProjectPage.js` and `TaskModal.js`.

### Sharing with a team
Each person creates their own account — they each see only their own projects. If you want shared projects (multiple people on the same project), that requires a small schema change — let me know and I can add it.

---

## Support

Built with:
- [React](https://react.dev)
- [Supabase](https://supabase.com) — database + auth
- [Vercel](https://vercel.com) — hosting
- [SheetJS](https://sheetjs.com) — Excel export
