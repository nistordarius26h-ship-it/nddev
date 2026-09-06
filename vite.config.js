import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",

  plugins: [react()],

  // .glb/.gltf aren't in Vite's default static-asset list, so without this
  // they wouldn't resolve as importable file URLs (3D model imports).
  assetsInclude: ["**/*.glb", "**/*.gltf"],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});