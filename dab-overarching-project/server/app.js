import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import { Redis } from "ioredis";
import postgres from "postgres";
import { cache } from "@hono/hono/cache";

const app = new Hono();
const sql = postgres({  
    host: Deno.env.get("PGHOST"),
    user: Deno.env.get("PGUSER"),
    password: Deno.env.get("PGPASSWORD"),
    database: Deno.env.get("PGDATABASE"),
    port: Deno.env.get("PGPORT"),
});
let redis;
if (Deno.env.get("REDIS_HOST")) {
  redis = new Redis(
    Number.parseInt(Deno.env.get("REDIS_PORT")),
    Deno.env.get("REDIS_HOST"),
  );
} else {
  redis = new Redis(6379, "redis");
}

app.use("/*", cors());
app.use("/*", logger());


app.get("/api/languages",
    cache({
        cacheName: "language-cache",
        wait: true,
      }),
);

app.get("/api/languages/:id/exercises",
    cache({
        cacheName: (c) => `exercise-cache-${c.req.param("id")}`,
        wait: true,
      }),
);

app.get("/api/languages", async (c) => {
    const languages = await sql`SELECT * FROM languages`;
    return c.json(languages);
});

app.get("/api/languages/:id/exercises", async (c) => {
    const exercises = await sql`SELECT id, title, description FROM exercises WHERE language_id = ${c.req.param("id")}`;
    return c.json(exercises);
});

app.get("/api/exercises/:id", async (c) => {
  const { id } = c.req.param();
  const exercise = await sql`
      SELECT id, title, description
      FROM exercises 
      WHERE id = ${id}
  `;

  if (exercise.length === 0) {
    return c.body(null, 404);
  }

  return c.json(exercise[0]);
});

app.get("/api/submissions/:id/status", async (c) => {
  const { id } = c.req.param();
  const submission = await sql`
      SELECT grading_status, grade
      FROM exercise_submissions
      WHERE id = ${id}
  `;

  if (submission.length === 0) {
    return c.body(null, 404);
  }

  return c.json(submission[0]);
});

app.post("/api/exercises/:id/submissions", async (c) => {
    const { id } = c.req.param();
    const { source_code } = await c.req.json();
    const result = await sql`
        INSERT INTO exercise_submissions (exercise_id, source_code) 
        VALUES (${id}, ${source_code}) 
        RETURNING id
    `;
    const submissionId = result[0].id;
    await redis.lpush("submissions", submissionId);
    return c.json({ id: submissionId });
});

export default app;