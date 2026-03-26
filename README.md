This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## CI Status Badge

After you connect this project to GitHub, replace `<OWNER>/<REPO>` below with your repository slug.

```md
![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)
```

Optional linkable version:

```md
[![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml)
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
AI-Powered Recipe Generator
This is a full-stack web application built with React, Next.js, and Tailwind CSS that leverages Hugging Face’s language models to generate cooking recipes based on user-provided ingredients.

Features
Responsive and user-friendly interface for ingredient input and recipe display.

Integration with Hugging Face NLP models to create dynamic, AI-generated recipes.

Basic authentication system including user registration, login, and session management.

Backend logic handled via Next.js API routes with simple data persistence using SQLite.

JSON-based recipe data management for easy manipulation and storage.

Designed for scalability to support features like user favorites, recipe categorization, and AI-driven image generation in future updates.

## Environment Variables

For persistent data on Vercel, set MongoDB environment variables:

```bash
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
MONGODB_DB=home_cooking
SESSION_SECRET=replace-with-a-long-random-string
```

Optional local-only SQLite override:

```bash
DATABASE_PATH=/absolute/path/to/database.db
```

Optional social auto-publish (n8n webhook):

```bash
N8N_SOCIAL_WEBHOOK_URL=https://your-n8n-host/webhook/home-cooking-social
N8N_SOCIAL_WEBHOOK_SECRET=replace-with-random-secret
SITE_URL=https://your-public-site-url
```

When a recipe is created as published, or moved from draft to published,
the API sends a webhook event (`recipe.publish`) to n8n.
If webhook is missing or fails, recipe save still succeeds.

When `MONGODB_URI` is set, API routes use MongoDB as primary storage.
If it is missing, the app falls back to SQLite.
