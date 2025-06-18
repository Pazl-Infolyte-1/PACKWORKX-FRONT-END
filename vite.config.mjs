import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
export default defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'build',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            coreui: ['@coreui/react', '@coreui/icons-react'],
          },
        },
      },
      target: 'es2015',
      minify: 'terser',

    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
          tailwind(),
        ],
      },
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ['import', 'legacy-js-api'],
        },
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
      jsx: 'automatic',
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@coreui/react',
        '@coreui/icons-react',
        'react-router-dom',
        'react-redux',
        'redux',
      ],
      exclude: ['@syncfusion/ej2-base'],
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      port: 3000,
      proxy: {
        // https://vitejs.dev/config/server-options.html
      },
    },
  }
})
