# 🎓 Placement Prep App

A modern, community-driven placement preparation platform where candidates share authentic interview experiences, round-by-round timelines, and company insights — powered by an **AI Placement Strategy & Cheatsheet Generator**.

---

## 🌟 Key Features

- **🏢 Company-Wise Placement Hub**: Browse authentic interview experiences categorized by top companies (Google, Amazon, Microsoft, Flipkart, etc.).
- **🎯 AI Placement Strategy & Cheatsheet Generator**: Synthesizes community interview reports, selection metrics, and recorded questions into actionable 14-day study roadmaps using Google Gemini.
- **⏱️ Round-by-Round Timelines**: Detailed breakdown of Online Assessments (OA), Technical Coding, System Design, and HR rounds.
- **🔐 Secure Authentication**: Integrated NextAuth v5 authentication with GitHub OAuth and credentials login.
- **👍 Upvoting & Bookmarking**: Save high-yield interview experiences and upvote helpful community posts.
- **🔍 Filter & Search**: Search experiences by role, verdict (Selected/Offered/Rejected), difficulty, and job type (Full-time/Internship).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router & Server Components)
- **Language**: TypeScript
- **Database & ORM**: PostgreSQL + Prisma ORM
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Authentication**: NextAuth.js v5 (Beta) + Prisma Adapter
- **Styling**: Tailwind CSS
- **Deployment**: Vercel / Node.js

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/sunay1524/placement-prep-app.git
cd placement-prep-app
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
AUTH_SECRET="your-auth-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Optional: Google Gemini API Key for Live AI Cheatsheet Generation
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Run Database Migrations & Seed Data

```bash
npx prisma migrate dev
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.
