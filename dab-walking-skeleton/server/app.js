import { Hono } from "@hono/hono";
import { Redis } from "ioredis";

const app = new Hono();

const redisProducer = new Redis(6379, "redis");

const QUEUE_NAME = "users";

app.post("/users", async (c) => {
  const { name } = await c.req.json();
  await redisProducer.lpush(QUEUE_NAME, JSON.stringify({ name }));
  c.status(202);
  return c.body("Accepted");
});

export default app;