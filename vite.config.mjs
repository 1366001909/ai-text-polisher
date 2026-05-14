import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    esbuildOptions: {
      sourcemap: false,
    },
  },
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // Dev mode: forward API requests to local backend service.
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
});