# 🚀 Ethara AI — Project Management Platform

> A modern, full-stack project management application built for **Ethara AI**, using **Next.js 16**, **PostgreSQL**, **Prisma ORM**, and **Better Auth**.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Scripts](#scripts)
- [Architecture Notes](#architecture-notes)
- [Contributing](#contributing)

---

## Overview

**Ethara AI** is a production-grade project management platform built for the Ethara AI company. Built on the latest Next.js App Router (`v16.2.4`) with React 19, it offers a seamless drag-and-drop Kanban board, real-time data updates, and a clean, accessible UI powered by ShadCN and Tailwind CSS v4.

The app supports full authentication via **Better Auth**, structured database modeling through **Prisma + PostgreSQL**, and interactive data visualization with **Recharts**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.4 (App Router) |
| **Language** | TypeScript 5 |
| **UI** | ShadCN UI + Tailwind CSS v4 |
| **ORM** | Prisma 7 (with `@prisma/adapter-pg`) |
| **Database** | PostgreSQL (via `pg` driver) |
| **Auth** | Better Auth v1.6 |
| **Data Fetching** | TanStack Query v5 + Axios |
| **Forms** | React Hook Form + Zod v4 |
| **Drag & Drop** | dnd-kit (core, sortable, modifiers) |
| **Charts** | Recharts 3.8 |
| **Package Manager** | Bun |
| **Linting** | ESLint 9 + eslint-config-next |

---

## Features

- ✅ **Authentication** — Secure sign-up/sign-in with Better Auth (session-based)
- 🗂️ **Kanban Board** — Drag-and-drop task management with `dnd-kit`
- 📋 **Data Tables** — Feature-rich tables powered by TanStack Table v8
- 📊 **Analytics Dashboard** — Visual charts with Recharts
- 🌙 **Dark Mode** — Theme switching via `next-themes`
- 🗓️ **Date Picker** — Calendar UI with `react-day-picker`
- 🔔 **Toast Notifications** — Non-blocking alerts using `sonner`
- 🔍 **Command Palette** — Quick navigation via `cmdk`
- 📦 **Drawer UI** — Mobile-friendly slide-up panels with `vaul`

---

## Project Structure

```
project_management_ethara_ai/
├── prisma/
│   └── schema.prisma          # Database models
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router (pages, layouts, API routes)
│   ├── components/            # Reusable UI components (ShadCN + custom)
│   ├── lib/                   # Utility functions, auth config, db client
│   └── ...
├── AGENTS.md                  # AI agent instructions
├── CLAUDE.md                  # Claude AI instructions
├── components.json            # ShadCN component config
├── next.config.ts             # Next.js configuration
├── prisma.config.ts           # Prisma config (custom path support)
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- **Bun** >= 1.x installed → [Install Bun](https://bun.sh)
- **PostgreSQL** database (local or cloud, e.g. NeonDB)
- **Node.js** >= 20 (for tooling compatibility)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Mobeenkhxn01/project_management_ethara_ai.git
cd project_management_ethara_ai

# 2. Install dependencies
bun install

# 3. Set up environment variables (see below)
cp .env.example .env

# 4. Push Prisma schema to database
bun prisma db push

# 5. Generate Prisma client
bun prisma generate

# 6. Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# PostgreSQL Connection
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> ⚠️ Never commit `.env` to version control. It's already listed in `.gitignore`.

---

## Database Setup

This project uses **Prisma** with a **PostgreSQL** adapter.

```bash
# Push schema changes to your database
bun prisma db push

# Open Prisma Studio (visual DB browser)
bun prisma studio

# Generate types after schema changes
bun prisma generate

# Run migrations (production)
bun prisma migrate deploy
```

> The `postinstall` script in `package.json` auto-runs `prisma generate` after every `bun install`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun lint` | Run ESLint |
| `bun prisma studio` | Open Prisma database UI |
| `bun prisma db push` | Sync schema to database |
| `bun prisma generate` | Regenerate Prisma client |

---

## Architecture Notes

### App Router (Next.js 16)
This project uses the **Next.js App Router** with React 19. File-based routing lives under `src/app/`. Server components are used for data fetching where possible, with client components only where interactivity is required.

### Authentication
**Better Auth** handles all authentication flows. Sessions are managed server-side. Refer to `src/lib/auth.ts` (or equivalent) for configuration.

### Data Fetching
- **Server components** → Direct Prisma queries (no API round-trip)
- **Client components** → TanStack Query + Axios hitting Next.js API routes under `src/app/api/`

### Drag & Drop
The Kanban board is built on `@dnd-kit/core` with `@dnd-kit/sortable` for smooth, accessible drag-and-drop interactions.

### Database
PostgreSQL is connected via Prisma using the `@prisma/adapter-pg` adapter for connection pooling support. Recommended hosting: **NeonDB** (serverless Postgres, supports connection pooling out of the box).

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow conventional commits and ensure `bun lint` passes before submitting.

---

## License

This project is private and not licensed for public distribution.

---

<div align="center">
  <p>Built with ❤️ using Next.js, Prisma, and Better Auth</p>
  <p>
    <a href="https://github.com/Mobeenkhxn01/project_management_ethara_ai">GitHub</a>
  </p>
</div>