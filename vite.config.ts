import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import Solid from "vite-plugin-solid";
import { viteSingleFile as SingleFileBuild } from "vite-plugin-singlefile";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [Solid(), UnoCSS(), process.env.SINGLEFILE ? SingleFileBuild() : []],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
