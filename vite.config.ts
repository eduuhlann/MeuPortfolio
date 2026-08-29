import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { apiMiddlewarePlugin } from "./viteApiPlugin.ts"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const [k, v] of Object.entries(env)) {
    if (process.env[k] === undefined) process.env[k] = v
  }

  return {
    plugins: [react(), tailwindcss(), apiMiddlewarePlugin()],
    assetsInclude: ['**/*.glb'],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    optimizeDeps: {
      exclude: ["@splinetool/runtime", "@splinetool/react-spline"],
    },
  }
})
