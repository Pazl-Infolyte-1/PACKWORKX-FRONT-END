const fs = require('fs');
const path = require('path');

// Script to fix common React/Vite build issues
console.log('🔧 Starting build fix process...');

// 1. Update index.html to ensure proper base path
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

fs.writeFileSync(indexHtmlPath, indexContent);
console.log('✅ Updated index.html with proper meta tags');

// 2. Create a .env file for production
const envContent = `
# Production environment variables
NODE_ENV=production
GENERATE_SOURCEMAP=false
BUILD_PATH=build
`;

fs.writeFileSync(path.join(__dirname, '.env.production'), envContent.trim());
console.log('✅ Created .env.production file');

// 3. Update browserslist if needed
const browserslistPath = path.join(__dirname, '.browserslistrc');
const browserslistContent = `
> 0.5%
last 2 versions
Firefox ESR
not dead
not IE 11
`;

fs.writeFileSync(browserslistPath, browserslistContent.trim());
console.log('✅ Updated .browserslistrc');

console.log('✅ Build fix process completed!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run build');
console.log('3. Test the production build');
