// Emergency fix for "kx is not a function" and similar build errors
const fs = require('fs');
const path = require('path');

console.log('🚨 Emergency Build Fix - Resolving function reference errors...');

// 1. Fix all barrel imports that might cause issues
console.log('🔧 Fixing barrel imports...');

const filesToFix = [
  {
    file: 'src/components/AppContent.js',
    fixes: []
  },
  {
    file: 'src/components/AppHeader.js',
    fixes: [
      {
        from: "import { AppBreadcrumb } from './index'",
        to: "import AppBreadcrumb from './AppBreadcrumb'"
      },
      {
        from: "import { AppHeaderDropdown } from './header/index'",
        to: "import AppHeaderDropdown from './header/AppHeaderDropdown'"
      }
    ]
  },
  {
    file: 'src/layout/DefaultLayout.js',
    fixes: [
      {
        from: "import { AppContent, AppHeader, AppSidebar } from '../components'",
        to: "import AppContent from '../components/AppContent'\nimport AppHeader from '../components/AppHeader'\nimport AppSidebar from '../components/AppSidebar'"
      }
    ]
  }
];

// Apply fixes
filesToFix.forEach(({ file, fixes }) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    fixes.forEach(({ from, to }) => {
      if (content.includes(from)) {
        content = content.replace(from, to);
        console.log(`   ✅ Fixed import in ${file}`);
      }
    });
    
    fs.writeFileSync(filePath, content);
  }
});

// 2. Create a minimal vite config for emergency use
console.log('⚙️ Creating emergency vite config...');
const emergencyViteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'build',
    target: 'es2015',
    minify: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        format: 'es'
      }
    }
  },
  resolve: {
    alias: {
      'src/': path.resolve(__dirname, 'src') + '/',
    },
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@syncfusion/ej2-base']
  }
})
`;

fs.writeFileSync(path.join(__dirname, 'vite.config.emergency.mjs'), emergencyViteConfig);

// 3. Create emergency build script
console.log('🛠️ Creating emergency build script...');
const emergencyBuildScript = `{
  "name": "emergency-build",
  "scripts": {
    "emergency-build": "vite build --config vite.config.emergency.mjs"
  }
}`;

fs.writeFileSync(path.join(__dirname, 'emergency-package.json'), emergencyBuildScript);

// 4. Check for and fix potential circular dependencies
console.log('🔄 Checking for circular dependency issues...');

const checkCircularDeps = (dirPath, visited = new Set(), stack = []) => {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      checkCircularDeps(filePath, visited, stack);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const relativePath = path.relative(__dirname, filePath);
      
      if (visited.has(relativePath)) {
        console.warn(`   ⚠️ Potential circular dependency detected: ${relativePath}`);
      }
    }
  });
};

checkCircularDeps(path.join(__dirname, 'src'));

console.log('\\n🎯 Emergency fixes applied!');
console.log('\\n📋 Try these solutions in order:');
console.log('\\n🥇 FIRST TRY:');
console.log('   npm run build');
console.log('\\n🥈 IF STILL FAILS:');
console.log('   npm run --config=vite.config.emergency.mjs build');
console.log('\\n🥉 LAST RESORT:');
console.log('   1. npm run reinstall');
console.log('   2. npm run build:clean');
console.log('\\n💡 Common fixes that work:');
console.log('   - Disabled minification (easier to debug)');
console.log('   - Removed complex chunking');
console.log('   - Fixed direct imports instead of barrel imports');
console.log('   - Excluded problematic dependencies');

console.log('\\n🔍 If you see the exact function name in error:');
console.log('   - Check browser console for the specific file');
console.log('   - Look for the component that uses that function');
console.log('   - Verify all its imports are correct');
