# Chichi's Kitchen – Deployment Guide

## Prerequisites
- Node.js 18+
- Git + GitHub account
- Vercel account (free)
- MySQL database (choose one below)

---

## Step 1: Set Up MySQL Database (Free Options)

### Option A: PlanetScale (Recommended — free tier)
1. Go to https://planetscale.com and create a free account
2. Create a new database → name it `chichis-kitchen`
3. Go to **Connect** → select **Prisma** as the framework
4. Copy the `DATABASE_URL` connection string

### Option B: Railway
1. Go to https://railway.app and create an account
2. New Project → Add MySQL
3. Click the MySQL service → **Connect** tab
4. Copy the `DATABASE_URL`

### Option C: Clever Cloud (EU)
1. Go to https://clever-cloud.com
2. Create a MySQL add-on (free tier)
3. Copy the connection details and form the URL:
   `mysql://USER:PASS@HOST:PORT/DATABASE`

---

## Step 2: Clone & Configure Locally

```bash
# Clone your repo (after pushing to GitHub)
git clone https://github.com/YOUR_USERNAME/chichis-kitchen.git
cd chichis-kitchen

# Install dependencies
npm install

# Copy env file
cp .env.example .env
```

Edit `.env` and fill in:
```env
DATABASE_URL="mysql://..."          # from Step 1
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

---

## Step 3: Set Up Database

```bash
# Push schema to database
npm run db:push

# Seed with admin user + menu items
npm run db:seed
```

Default admin credentials:
- **Email:** admin@chichiskitchen.com
- **Password:** admin123

> ⚠️ Change these immediately after first login in production!

---

## Step 4: Run Locally

```bash
npm run dev
```

Visit:
- **Website:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login

---

## Step 5: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Chichi's Kitchen"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/chichis-kitchen.git
git push -u origin main
```

---

## Step 6: Deploy to Vercel

### A. Import project
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)

### B. Add environment variables
In Vercel dashboard → Settings → Environment Variables, add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your MySQL connection string |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Your generated secret |

### C. Deploy
Click **Deploy**. Vercel will build and deploy automatically.

### D. Run seed on production (one-time)
After deployment, in Vercel dashboard → Functions → Run:
```bash
npx prisma db seed
```
Or connect locally with production `DATABASE_URL` and run `npm run db:seed`.

---

## Step 7: Post-Deployment Checklist

- [ ] Visit `https://your-app.vercel.app` — home page loads
- [ ] Visit `/menu` — meals appear (seeded from DB)
- [ ] Add item to cart and complete checkout
- [ ] Login to `/admin/login` with seeded credentials
- [ ] Check dashboard shows the test order
- [ ] Change admin password via DB or add a settings page
- [ ] Update `NEXTAUTH_URL` to your actual Vercel domain

---

## Folder Structure

```
chichis-kitchen/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── schema.sql          # Raw SQL for reference
│   └── seed.ts             # DB seed script
├── src/
│   ├── app/
│   │   ├── (customer)/     # Public customer pages
│   │   │   ├── page.tsx            # Home
│   │   │   ├── menu/page.tsx       # Menu
│   │   │   ├── cart/page.tsx       # Cart
│   │   │   ├── checkout/page.tsx   # Checkout
│   │   │   ├── contact/page.tsx    # Contact
│   │   │   └── order-confirmation/ # Confirmation
│   │   ├── admin/          # Admin panel (protected)
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── menu/page.tsx
│   │   │   └── customers/page.tsx
│   │   └── api/            # API routes
│   │       ├── auth/
│   │       ├── menu/
│   │       ├── orders/
│   │       ├── customers/
│   │       └── admin/
│   ├── components/
│   │   ├── layout/         # Navbar, Footer
│   │   └── admin/          # AdminSidebar
│   ├── hooks/
│   │   └── useCart.tsx     # Cart context + localStorage
│   ├── lib/
│   │   ├── auth.ts         # NextAuth config
│   │   ├── prisma.ts       # Prisma client
│   │   └── utils.ts        # Helpers
│   ├── middleware.ts        # Route protection
│   └── types/index.ts      # TypeScript types
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:push      # Push schema changes to DB
npm run db:seed      # Seed admin + menu data
npm run db:studio    # Open Prisma Studio (visual DB editor)
```

---

## Admin Credentials (Default)

| Field | Value |
|-------|-------|
| Email | admin@chichiskitchen.com |
| Password | admin123 |
| URL | /admin/login |

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| Animations | Framer Motion |
| Backend | Next.js API Routes |
| ORM | Prisma 5 |
| Database | MySQL (PlanetScale/Railway) |
| Auth | NextAuth v5 (JWT) |
| Hosting | Vercel |
| Version Control | GitHub |

---

## Support

For issues:
- Prisma docs: https://prisma.io/docs
- NextAuth docs: https://authjs.dev
- Next.js docs: https://nextjs.org/docs
- Vercel docs: https://vercel.com/docs
