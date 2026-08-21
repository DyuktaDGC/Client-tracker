import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.N8N_BASE_URL?.replace(/\/+$/, '')

  return {
    plugins: [react(), tailwindcss()],
    build: { target: 'es2022', sourcemap: false },
    server: {
      proxy: target
        ? {
            '/api': {
              target,
              changeOrigin: true,
              secure: true,
              rewrite: (path) =>
                path.replace(/^\/api\/assignments/, '/dgc/data?view=dashboard').replace(/^\/api/, ''),
              headers:
                env.N8N_HEADER_NAME && env.N8N_HEADER_VALUE
                  ? { [env.N8N_HEADER_NAME]: env.N8N_HEADER_VALUE }
                  : undefined,
            },
          }
        : undefined,
    },
  }
})
