# Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Turso account (optional for local development)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd filipino_profanity_api
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

## Environment Variables

Edit `.env` file with your Turso credentials:

```env
TURSO_DATABASE_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
```

**Note:** For local development without Turso, the API will automatically use JSON fallback.

## Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Building for Production

```bash
npm run build
npm start
```

## Database Setup (Optional)

To use Turso database instead of JSON fallback:

1. Create a Turso account at [turso.tech](https://turso.tech)

2. Create a new database:
```bash
turso db create filipino-profanity
```

3. Get the database URL and auth token:
```bash
turso db show filipino-profanity --url
turso auth token
```

4. Update your `.env` file with these values

5. Seed the database:
```bash
npx tsx scripts/seed.ts
```
