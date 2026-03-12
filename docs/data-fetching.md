# Data Fetching

## Rule: Server Components Only

**All data fetching MUST be done exclusively via React Server Components.**

Do NOT fetch data via:
- Route handlers (`app/api/...`)
- Client components (`"use client"`)
- `useEffect` + `fetch`
- SWR, React Query, or any client-side fetching library
- Any other mechanism

If a component needs data, it must be a Server Component (no `"use client"` directive) that `await`s data directly.

```tsx
// CORRECT — Server Component fetching data
import { getWorkoutsByUser } from "@/data/workouts";

export default async function WorkoutsPage() {
  const workouts = await getWorkoutsByUser(userId);
  return <WorkoutList workouts={workouts} />;
}
```

```tsx
// WRONG — never do this
"use client";
useEffect(() => {
  fetch("/api/workouts").then(...);
}, []);
```

---

## Rule: Database Queries via `/data` Helper Functions

**All database queries MUST go through helper functions in the `/data` directory.**

- Use [Drizzle ORM](https://orm.drizzle.team/) for all queries — **never write raw SQL**
- One file per domain entity (e.g., `data/workouts.ts`, `data/exercises.ts`)
- Helper functions are the only place database calls occur

```ts
// data/workouts.ts — CORRECT
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsByUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

```ts
// WRONG — raw SQL, never do this
const result = await db.execute(sql`SELECT * FROM workouts`);
```

---

## Rule: Users Can Only Access Their Own Data

**Every data helper function that returns user-owned data MUST filter by the authenticated user's ID.**

- Always obtain the current user's ID from the auth session inside the helper (or pass it in as a required parameter)
- Never expose a function that fetches data for an arbitrary user without an authorization check
- There must be no way for a logged-in user to retrieve another user's records

```ts
// data/workouts.ts — CORRECT: always scoped to the authenticated user
import { auth } from "@/auth";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsByUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, session.user.id));
}
```

```ts
// WRONG — fetching by an arbitrary ID with no auth check
export async function getWorkouts(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

---

## Summary

| Rule | Requirement |
|------|-------------|
| Where to fetch data | Server Components only |
| How to query the database | Drizzle ORM via `/data` helpers |
| Raw SQL | Never |
| Data access scope | Logged-in user's own data only, enforced in every helper |
