Project Title

Free Filipino Profanity API

🧠 Objective

Build a fully functional web app using my existing Next.js + TailwindCSS project.

⚠️ IMPORTANT:

I already have a JSON API for Filipino and Regional profanity inside /app/api
You MUST reuse and enhance it, NOT recreate from scratch
⚙️ CORE REQUIREMENTS
1. 🔁 USE EXISTING API (CRITICAL)
Locate existing API inside:
/app/api/
Extend it to support:
?type=filipino
?type=regional
?type=all
?word=<search>
Ensure:
Clean filtering logic
Fast response
No duplication of logic
🗄️ DATABASE INTEGRATION (TURSO)
🎯 Requirement:

Integrate Turso (libSQL) as the database.

📦 Install Dependencies
npm install @libsql/client drizzle-orm dotenv
📁 Create ENV file
.env
🔐 Default Placeholder Credentials:
TURSO_DATABASE_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here

⚠️ IMPORTANT:

These are placeholders only
Do NOT hardcode real credentials
Use process.env everywhere
🔌 Database Connection Setup

Create:

/lib/turso.ts

Example:

import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
🧱 DATABASE TABLE DESIGN

Create table:

CREATE TABLE profanity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT NOT NULL,
  language TEXT NOT NULL,
  region TEXT,
  severity TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
🌱 SEED DATA (IMPORTANT)
Migrate your existing JSON data into Turso
Create:
/scripts/seed.ts
Insert:
Filipino words
Regional words
🔥 API ENHANCEMENT

Modify existing API to:

Fetch from Turso instead of static JSON
Still allow fallback to JSON if DB fails
✅ FINAL RESPONSE FORMAT
{
  "success": true,
  "type": "all",
  "count": 10,
  "data": [
    {
      "word": "example",
      "language": "filipino",
      "region": null,
      "severity": "high"
    }
  ]
}
⚡ REAL-TIME TESTING UI

Create a Testing Panel:

Features:
Dropdown:
Filipino
Regional
All
Button: Run API Test
Display JSON output
🎨 JSON VIEWER (VS CODE STYLE)

Use:

Prism.js or Shiki
Color Rules:
Keys → blue
Strings → green
Numbers → orange
🧩 UI COMPONENTS
Required Components:
ApiTester.tsx
JsonViewer.tsx
DashboardStats.tsx
GithubRepoCard.tsx
🔗 GITHUB INTEGRATION

Create section:

“View Source Code”
Show:
Repo name
Description
Button → opens GitHub repo
📊 DASHBOARD

Display:

Total profanity words
Filipino count
Regional count
Severity distribution

Use:

npm install recharts
🎨 DESIGN SYSTEM
Dark mode default
Glassmorphism UI
Smooth animations (Framer Motion)
Fully responsive
Clean modern SaaS look
🧠 EXTRA FEATURES

Add:

🔍 Search input
🎚️ Severity filter
📋 Copy JSON button
⚡ Loading animation
❌ Error UI
🌐 Language toggle
📘 DOCUMENTATION (MANDATORY)

Create /docs folder:

/docs/SETUP.md

Include:

Install dependencies
Setup Turso
Configure .env
/docs/API.md
Endpoint usage
Query params
Example responses
/docs/DATABASE.md
Schema
Seeding process
Migration guide
/docs/FEATURES.md
All features explained
UI breakdown
🚀 FETCH EXAMPLES (FINAL OUTPUT)
✅ JavaScript (Fetch)
async function getData() {
  try {
    const response = await fetch("http://localhost:3000/api/profanity?type=all");
    if (!response.ok) {
      throw new Error("HTTP error! Status: " + response.status);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
getData();
✅ Axios
import axios from "axios";

async function getData() {
  try {
    const response = await axios.get("http://localhost:3000/api/profanity?type=all");
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

getData();
✅ Python
import requests

try:
    response = requests.get("http://localhost:3000/api/profanity?type=all")
    response.raise_for_status()
    data = response.json()
    print(data)
except requests.exceptions.RequestException as e:
    print("Error fetching data:", e)
🧪 TESTING REQUIREMENTS
API must return valid JSON
No crashes if DB is empty
Works even if Turso is not connected (fallback to JSON)
UI updates instantly
Handles invalid query params
🧾 FINAL INSTRUCTIONS
DO NOT recreate the API — extend existing one
Use Turso properly with env variables
Keep code clean and modular
Document EVERYTHING
Ensure production-ready output
Optimize performance
💡 OPTIONAL (ADVANCED)

If capable, add:

API rate limiting
API key authentication
Profanity detection from user input text
Export JSON file
Caching layer