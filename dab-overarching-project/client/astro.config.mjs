import { defineConfig } from "astro/config";
import deno from "@deno/astro-adapter";
import svelte from "@astrojs/svelte";

export default defineConfig({
  adapter: deno(),
  integrations: [svelte()]
});