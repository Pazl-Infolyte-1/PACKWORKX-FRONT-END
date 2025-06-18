const fs = require('fs');
const path = require('path');

// Comprehensive script to fix React/Vite build issues
console.log('🔧 Starting comprehensive build fix process...');

// 1. Clean up previous builds and cache
console.log('🧹 Cleaning previous builds and cache...');
const dirsToClean = ['build', 'dist', 'node_modules/.vite'];
dirsToClean.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`   Cleaned: ${dir}`);
  }
});

// 2. Update index.html to ensure proper base path
console.log('📝 Updating index.html...');
const indexHtmlPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexHtmlPath, 'utf8');

// Ensure proper meta tags and script loading
if (!indexContent.includes('<meta charset="UTF-8" />')) {
  indexContent = indexContent.replace('<head>', '<head>\n    <meta charset="UTF-8" />');
}

if (!indexContent.includes('crossorigin')) {
  indexContent = indexContent.replace(
    '<script type="module" src="/src/index.js"></script>',
    '<script type="module" crossorigin src="/src/index.js"></script>'
  );
}

// Add proper viewport and other essential meta tags
if (!indexContent.includes('viewport')) {
  indexContent = indexContent.replace(
    '<meta charset="UTF-8" />',
    '<meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />'
  );
}

fs.writeFileSync(indexHtmlPath, indexContent);
console.log('✅ Updated index.html with proper meta tags');

// 3. Create optimized .env files
console.log('⚙️ Creating environment configuration...');
const envProductionContent = `# Production environment
NODE_ENV=production
GENERATE_SOURCEMAP=true
BUILD_PATH=build
VITE_BUILD_TARGET=es2015
`;

const envDevelopmentContent = `# Development environment
NODE_ENV=development
VITE_DEV_SERVER_PORT=3000
`;

fs.writeFileSync(path.join(__dirname, '.env.production'), envProductionContent.trim());
fs.writeFileSync(path.join(__dirname, '.env.development'), envDevelopmentContent.trim());
console.log('✅ Created .env files');

// 4. Update browserslist for better compatibility
console.log('🌐 Updating browser compatibility...');
const browserslistPath = path.join(__dirname, '.browserslistrc');
const browserslistContent = `> 0.5%
last 2 versions
Firefox ESR
not dead
not IE 11
not op_mini all`;

fs.writeFileSync(browserslistPath, browserslistContent);
console.log('✅ Updated .browserslistrc');

// 5. Create a debug build script
console.log('🔧 Creating debug build script...');
const debugBuildScript = `#!/usr/bin/env node

// Debug build script for troubleshooting
console.log('🐛 Starting debug build...');

const { spawn } = require('child_process');

// Run build with verbose output
const buildProcess = spawn('npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    DEBUG: '*',
    VITE_DEBUG: 'true'
  }
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Debug build completed successfully!');
  } else {
    console.log('❌ Debug build failed with code:', code);
    console.log('\n🔍 Common solutions:');
    console.log('1. Check for circular dependencies');
    console.log('2. Verify all imports/exports are correct');
    console.log('3. Check for conflicting package versions');
    console.log('4. Review vite.config.mjs settings');
  }
});
`;

fs.writeFileSync(path.join(__dirname, 'debug-build.js'), debugBuildScript);
console.log('✅ Created debug build script');

// 6. Create dependency check script
console.log('📦 Creating dependency check script...');
const depCheckScript = `const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

console.log('🔍 Checking for potential problematic dependencies...');

const problematicPatterns = [
  { pattern: /react.*19/, message: 'React 19 may have compatibility issues. Consider using React 18.' },
  { pattern: /@syncfusion/, message: 'Syncfusion packages may cause build issues. Check if all are needed.' },
  { pattern: /webpack/, message: 'Webpack dependencies in a Vite project may cause conflicts.' }
];

const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

Object.entries(allDeps).forEach(([name, version]) => {
  problematicPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(name + version)) {
      console.warn('⚠️', name, version, '-', message);
    }
  });
});

console.log('✅ Dependency check completed.');
`;

fs.writeFileSync(path.join(__dirname, 'check-deps.js'), depCheckScript);
console.log('✅ Created dependency check script');

console.log('\n🎉 Comprehensive build fix completed!');
console.log('\n📋 Next steps:');
console.log('1. Run: node check-deps.js  (check for problematic dependencies)');
console.log('2. Run: npm install');
console.log('3. Run: npm run build  (or node debug-build.js for verbose output)');
console.log('4. Test: npm run serve');
console.log('\n💡 If issues persist:');
console.log('- Check console errors for specific function names');
console.log('- Try: npm run build with sourcemaps enabled');
console.log('- Review BUILD_FIX_GUIDE.md for detailed troubleshooting');
