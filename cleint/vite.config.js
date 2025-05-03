import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import lineClamp from "@tailwindcss/line-clamp";
export default defineConfig({
  server: {
    proxy: {
      "/api": { target: "http://localhost:3000", secure: false },
    },
  },
  plugins: [
    lineClamp(),
    tailwindcss(),
    // ...
  ],
});
