import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
export default defineConfig(() => {
  return {
    base: './',
    define: {
      global: 'globalThis',
    },
    build: {
      outDir: 'build',
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor'
              }
              if (id.includes('@coreui')) {
                return 'coreui'
              }
              if (id.includes('@syncfusion')) {
                return 'syncfusion'
              }
              if (id.includes('redux') || id.includes('react-redux')) {
                return 'redux'
              }
              return 'vendor'
            }
          },
        },
      },
      target: 'es2015',
      minify: false, // Disable minification temporarily for debugging
      sourcemap: true, // Enable source maps for debugging
      chunkSizeWarningLimit: 1600,
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}),
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
      jsx: 'automatic',
      jsxImportSource: 'react',
      loader: 'jsx',
      include: /src\/.*\.[jt]sx?$/,
      exclude: [],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@coreui/react',
        '@coreui/icons-react',
        '@coreui/icons',
        'react-router-dom',
        'react-redux',
        'redux',
        'classnames',
        'prop-types',
        'simplebar-react',
      ],
      exclude: [
        '@syncfusion/ej2-base',
        '@syncfusion/ej2-react-buttons',
        '@syncfusion/ej2-react-calendars',
        '@syncfusion/ej2-react-charts',
        '@syncfusion/ej2-react-dropdowns',
        '@syncfusion/ej2-react-inputs',
        '@syncfusion/ej2-react-navigations',
        '@syncfusion/ej2-react-notifications',
        '@syncfusion/ej2-react-popups',
        '@syncfusion/ej2-react-schedule',
      ],
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [
      react({
        jsxImportSource: 'react',
        jsxRuntime: 'automatic',
      })
    ],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
      dedupe: ['react', 'react-dom'],
    },
    server: {
      port: 3000,
      proxy: {},
    },
  }
})
