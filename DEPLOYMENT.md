# Deployment Guide - Parse

## Prerequisites

1. A Vercel account ([sign up here](https://vercel.com/signup))
2. The Vercel CLI installed: `npm i -g vercel`
3. A PostgreSQL database (we'll use Vercel Postgres)

## Step 1: Set Up Vercel Postgres

1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Follow the prompts to create your database
4. Copy the connection string (you'll need this for environment variables)

## Step 2: Configure Environment Variables

In your Vercel project settings, add these environment variables:

```bash
DATABASE_URL="<your-vercel-postgres-connection-string>"
BETTER_AUTH_SECRET="<generate-a-random-32-char-string>"
BETTER_AUTH_URL="https://your-app.vercel.app"
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

## Step 3: Update .gitignore

Make sure these are in your `.gitignore`:
```
.env.local
.env*.local
.vercel
```

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel CLI

```bash
cd parse-web
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N** (first time)
- Project name? **parse** or your preferred name
- Directory? `.` (current directory)

### Option B: Deploy via Git

1. Push your code to GitHub
2. Go to Vercel dashboard
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: **parse-web**
   - Build Command: `npm run build`
   - Install Command: `npm install`

## Step 5: Run Database Migrations

After deployment, you need to run migrations on your production database.

### Method 1: Local to Remote

```bash
# Set your production DATABASE_URL temporarily
export DATABASE_URL="<your-vercel-postgres-connection-string>"

# Run migrations
npm run db:generate
npm run db:migrate

# Optionally seed data (for testing)
npm run db:seed
```

### Method 2: Via Vercel CLI

```bash
vercel env pull .env.production.local
npm run db:migrate
```

## Step 6: Verify Deployment

1. Visit your deployed URL (e.g., `https://parse.vercel.app`)
2. Try signing up for an account
3. Create a test post
4. Verify everything works!

## Updating Your Deployment

Every time you push to your main branch (if connected via Git), Vercel will automatically deploy.

Or manually deploy:
```bash
vercel --prod
```

## Troubleshooting

### Build Errors

Check the Vercel deployment logs for specific errors.

### Database Connection Issues

- Verify your `DATABASE_URL` is correct in Vercel environment variables
- Make sure you've run migrations
- Check Vercel Postgres dashboard for connection issues

### Authentication Issues

- Ensure `BETTER_AUTH_URL` matches your deployed domain
- Verify `BETTER_AUTH_SECRET` is set and is at least 32 characters

### Migration Issues

If migrations fail, you can connect to your Vercel Postgres database directly:

```bash
# Get connection string from Vercel dashboard
psql "<your-connection-string>"

# Check tables
\dt

# View schema
\d persons
\d posts
```

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Database migrations run successfully
- [ ] Test user account can be created
- [ ] Posts can be created and viewed
- [ ] Authentication works (login/logout)
- [ ] No console errors in browser
- [ ] Check Vercel deployment logs for any warnings

## Notes

- The first deployment might take longer
- Vercel will cache builds for faster subsequent deployments
- Database is persistent across deployments
- Environment variables are encrypted by Vercel
