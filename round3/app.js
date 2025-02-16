import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { etag } from "@hono/hono/etag";

const app = new Hono();

app.use(etag());
app.use(serveStatic({ root: "./" }));

Deno.serve(app.fetch);