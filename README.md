# Payflow

Personal monthly payment tracker to manage recurring bills. Built with Next.js 16, Drizzle ORM, and Neon Postgres.

Track your monthly payments, mark them as paid, see totals at a glance, and duplicate them across months.

## Features

- **Monthly payment tracking** — organize payments by month with description, amount, due day, and category
- **Payment status** — mark items as paid or pending with a single tap
- **Financial summary** — see total, paid, and pending amounts with a visual progress bar
- **Month navigation** — browse payments across months easily
- **Duplicate to next month** — carry over payments from one month to the next
- **Password-protected** — single-user authentication with JWT sessions and rate limiting
- **Mobile-friendly** — responsive design that works on any device

## Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router with Server Actions
- [React 19](https://react.dev/)
- [Drizzle ORM](https://orm.drizzle.team/) — type-safe SQL queries
- [Neon Postgres](https://neon.tech/) — serverless Postgres (or local via Docker)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [jose](https://github.com/panva/jose) — JWT authentication
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — password hashing
- [Lucide React](https://lucide.dev/) — icons

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) (for local Postgres) or a [Neon](https://neon.tech/) account

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/vc-billings.git
cd vc-billings
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Postgres connection string. Use the Docker default or your Neon URL |
| `AUTH_PASSWORD_HASH` | Base64-encoded bcrypt hash of your login password |
| `AUTH_SECRET` | Random string (32+ chars) used for JWT signing |

**Generate your password hash:**

```bash
node scripts/generate-hash.mjs your-password
```

**Generate a random secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start the database

```bash
docker compose up -d
```

### 4. Push the schema

```bash
npm run db:push
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with your password.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |

## Project Structure

```
src/
├── actions/
│   ├── auth-actions.ts        # Login/logout server actions
│   └── payment-actions.ts     # CRUD + duplicate server actions
├── app/
│   ├── dashboard/page.tsx     # Main dashboard page
│   ├── login/page.tsx         # Login page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── duplicate-month.tsx    # Copy payments to next month
│   ├── header.tsx             # App header with logout
│   ├── month-selector.tsx     # Month navigation
│   ├── payment-card.tsx       # Individual payment card
│   ├── payment-form.tsx       # Create/edit payment modal
│   ├── payment-list.tsx       # Payment list with add button
│   └── summary-bar.tsx        # Financial summary with progress
├── lib/
│   ├── auth.ts                # JWT session management
│   ├── db/
│   │   ├── index.ts           # Database connection (Neon or local)
│   │   └── schema.ts          # Drizzle schema definition
│   ├── month-helpers.ts       # Date/currency utilities
│   └── rate-limit.ts          # In-memory rate limiting
└── middleware.ts               # Route protection
```

## Deploying to Vercel

1. Push the repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add the environment variables (`DATABASE_URL`, `AUTH_PASSWORD_HASH`, `AUTH_SECRET`)
4. Deploy

For production, use a [Neon](https://neon.tech/) database — the app automatically detects the connection and uses the serverless driver.

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "Add my feature"`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).
