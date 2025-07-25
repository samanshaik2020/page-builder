# Deployment Guide for SquPage.com

## Prerequisites
- Vercel account (free)
- GoDaddy domain: squpage.com
- Supabase project with database setup

## Step 1: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Add environment variables (see below)
5. Deploy

### Option B: Via CLI
1. Login: `vercel login`
2. Deploy: `vercel --prod`

## Step 2: Environment Variables
Add these to your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 3: Configure Custom Domain

### In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Add `squpage.com` and `www.squpage.com`

### In GoDaddy DNS:
1. Log into GoDaddy DNS Management
2. Add these DNS records:

```
Type: A
Name: @
Value: 76.76.19.61
TTL: 1 Hour

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
TTL: 1 Hour
```

## Step 4: SSL Certificate
Vercel automatically provides SSL certificates. Your site will be accessible at:
- https://squpage.com
- https://www.squpage.com

## Step 5: Database Setup
Ensure your Supabase database has the required tables:
- Run the SQL from `supabase-schema.sql`
- Enable Row Level Security (RLS)
- Configure authentication policies

## Verification
After deployment, test:
1. Landing page creation
2. Email collection functionality  
3. User authentication
4. Database operations

## Troubleshooting
- Check Vercel function logs for errors
- Verify environment variables are set
- Ensure Supabase RLS policies allow operations
- DNS changes can take up to 48 hours to propagate
