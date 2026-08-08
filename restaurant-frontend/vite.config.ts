import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Keep maplibre-gl out of the dep pre-bundle so the main thread and the worker
    // (see setWorkerUrl in pages/Map/Map.tsx) are built from the same module copy.
    // Pre-bundling one side but not the other makes tiles silently never load.
    exclude: ['maplibre-gl'],
  },
  // maplibre-gl starts its worker with { type: "module" }, so Vite has to emit an
  // ES module worker rather than the default IIFE.
  worker: { format: 'es' },
})
