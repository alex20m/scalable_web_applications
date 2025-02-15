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
        cacheName: "exercise-cache",
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

export default app;