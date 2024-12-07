import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import Solid from "vite-plugin-solid";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [Solid(), UnoCSS()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
