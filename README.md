# VC Billings

Personal monthly payment tracker built with Next.js, Neon Postgres, and Drizzle ORM.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

**DATABASE_URL** - Your Neon Postgres connection string from [neon.tech](https://neon.tech).

**AUTH_PASSWORD_HASH** - Generate a bcrypt hash of your chosen password:

```bash
node -e "require('bcryptjs').hash('your-password', 10).then(console.log)"
```

**AUTH_SECRET** - Generate a random secret for JWT signing:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Run database migrations

```bash
npx drizzle-kit push
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with your password.

## Deploying to Vercel

1. Push the repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add the three environment variables (`DATABASE_URL`, `AUTH_PASSWORD_HASH`, `AUTH_SECRET`)
4. Deploy

## Tech Stack

- **Next.js 15** (App Router, Server Actions)
- **Neon Postgres** + **Drizzle ORM**
- **Tailwind CSS v4**
- **jose** for JWT authentication
- **bcryptjs** for password hashing
