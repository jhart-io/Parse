# Parse Web

A platform for sharing short stories, intentional moments, and thoughts.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Custom username/password auth with cookie sessions
- **Styling**: Tailwind CSS v4 + ShadCN UI
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for local PostgreSQL)
- npm or pnpm

### Local Development Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Start the PostgreSQL database:**
   ```bash
   cd ..  # Go to project root
   docker compose up -d
   cd parse-web
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your local database credentials (defaults are in docker-compose.yml).

4. **Run database migrations:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Seed the database (optional):**
   ```bash
   npm run db:seed
   ```

   This creates a test user:
   - Username: `testuser`
   - Password: `password123`

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000)**

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database
- `npm run db:generate` - Generate new migrations from schema changes
- `npm run db:migrate` - Run pending migrations
- `npm run db:studio` - Open Drizzle Studio (visual database browser)
- `npm run db:seed` - Seed database with test data

## Project Structure

```
parse-web/
├── app/                      # Next.js App Router
│   ├── actions/             # Server Actions
│   ├── api/                 # API Routes
│   ├── compose/             # Compose page
│   ├── login/               # Login page
│   └── signup/              # Signup page
├── components/              # React components
│   ├── composer/           # Post composer
│   ├── feed/               # Post feed components
│   ├── ui/                 # ShadCN UI components
│   └── header.tsx          # Main header
├── db/                      # Database
│   ├── migrations/         # SQL migrations
│   ├── schema.ts           # Drizzle schema
│   ├── index.ts            # DB client
│   ├── migrate.ts          # Migration runner
│   └── seed.ts             # Seed script
├── domains/                 # Business logic
│   ├── auth/               # Authentication
│   └── posts/              # Posts domain
└── lib/                     # Utilities
```

## Features

- ✅ User authentication (username/password)
- ✅ Create and publish posts (100 words max)
- ✅ View public feed
- ✅ Real-time word counter
- ✅ Dark mode support
- ✅ Responsive design

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for complete deployment instructions to Vercel.

Quick deploy:
```bash
vercel
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `BETTER_AUTH_SECRET` | Secret key for auth (32+ chars) | Yes |
| `BETTER_AUTH_URL` | Base URL of your app | Yes |

## Contributing

1. Make your changes
2. Run `npm run build` to ensure it builds
3. Test locally
4. Create a pull request

## License

MIT
