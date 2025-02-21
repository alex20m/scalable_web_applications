import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte"; //Not working
import deno from "@deno/astro-adapter";

export default defineConfig({
  adapter: deno(),
  integrations: [svelte()], //Not working
});