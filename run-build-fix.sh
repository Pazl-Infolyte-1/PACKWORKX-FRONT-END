#!/bin/bash

echo "🚀 PACKWORKX Build Fix Script"
echo "=============================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Step 1: Cleaning old builds and cache..."
rm -rf build dist node_modules/.vite

echo "📋 Step 2: Installing dependencies..."
npm install

echo "🔧 Step 3: Running build fixes..."
node fix-build.js

echo "🏗️  Step 4: Building production version..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "🎉 Next steps:"
    echo "1. Test locally: npm run serve"
    echo "2. Upload the 'build' folder to your server"
    echo "3. Ensure your server is configured to serve static files"
    echo ""
    echo "📝 If you still encounter issues, check BUILD_FIX_GUIDE.md"
else
    echo "❌ Build failed. Trying emergency fix..."
    echo ""
    echo "🚨 Running emergency build fix..."
    node emergency-fix.js
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Emergency build succeeded!"
    else
        echo "❌ Emergency build also failed."
        echo "📝 Manual solutions:"
        echo "1. Check BUILD_FIX_GUIDE.md"
        echo "2. Try: npx vite build --config vite.config.emergency.mjs"
        echo "3. Check browser console for specific error details"
        exit 1
    fi
fi
