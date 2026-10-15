import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * `ReactMarkdown` on `window.__FOXEL_EXTERNALS__` is the host's react-markdown
 * component. Render it with the host React. This bundle does not include either.
 */
const external = ['react', 'react-dom', 'react-dom/client'];

const globals = {
  react: 'window.__FOXEL_EXTERNALS__.React',
  'react-dom': 'window.__FOXEL_EXTERNALS__.ReactDOM',
  'react-dom/client': 'window.__FOXEL_EXTERNALS__.ReactDOM',
};

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    outDir: 'frontend',
    emptyOutDir: false,
    sourcemap: false,
    cssCodeSplit: false,
    lib: {
      entry: 'src/index.tsx',
      formats: ['iife'],
      name: 'FoxelMarkdown',
      fileName: () => 'index.js',
      cssFileName: 'player',
    },
    rolldownOptions: {
      external,
      output: { globals },
    },
  },
});
