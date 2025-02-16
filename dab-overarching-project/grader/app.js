import { Hono } from "@hono/hono";
import { Redis } from "ioredis";
import postgres from "postgres";

const sql = postgres();
const QUEUE_NAME = "submissions";
let consumeEnabled = false;
const app = new Hono();
let redis;
if (Deno.env.get("REDIS_HOST")) {
  redis = new Redis(
    Number.parseInt(Deno.env.get("REDIS_PORT")),
    Deno.env.get("REDIS_HOST"),
  );
} else {
  redis = new Redis(6379, "redis");
}

app.get("/api/status", async (c) => {
    const queueSize = await redis.llen(QUEUE_NAME);
    return c.json({queue_size: queueSize, consume_enabled: consumeEnabled });
});

app.post("/api/consume/enable", (c) => {
    consumeEnabled = true;
    consume();
    return c.json({ consume_enabled: true });
});

app.post("/api/consume/disable", (c) => {
    consumeEnabled = false;
    return c.json({ consume_enabled: false });
});

const consume = async () => {
    while (consumeEnabled) {
        const queueSize = await redis.llen(QUEUE_NAME);
        if (queueSize > 0) {
            const submissionId = await redis.lpop(QUEUE_NAME);

            await sql`UPDATE exercise_submissions SET grading_status = 'processing' WHERE id = ${submissionId}`;
            
            const gradingTime = Math.floor(Math.random() * 2000) + 1000;  // Simulate grading time between 1 and 3 seconds
            await new Promise((r) => setTimeout(r, gradingTime));

            const grade = Math.floor(Math.random() * 101);  // Random grade between 0 and 100
            await sql`UPDATE exercise_submissions SET grading_status = 'graded', grade = ${grade} WHERE id = ${submissionId}`;
        }
        else {
            await new Promise((r) => setTimeout(r, 250));
        }
    }
};

export default app;