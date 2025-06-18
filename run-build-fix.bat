@echo off
echo 🚀 PACKWORKX Build Fix Script
echo ==============================

REM Check if we're in the right directory
if not exist package.json (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

echo 📦 Step 1: Cleaning old builds and cache...
if exist build rmdir /s /q build
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite

echo 📋 Step 2: Installing dependencies...
call npm install

echo 🔧 Step 3: Running build fixes...
call node fix-build.js

echo 🏗️  Step 4: Building production version...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build completed successfully!
    echo.
    echo 🎉 Next steps:
    echo 1. Test locally: npm run serve
    echo 2. Upload the 'build' folder to your server
    echo 3. Ensure your server is configured to serve static files
    echo.
    echo 📝 If you still encounter issues, check BUILD_FIX_GUIDE.md
) else (
    echo ❌ Build failed. Trying emergency fix...
    echo.
    echo 🚨 Running emergency build fix...
    call node emergency-fix.js
    call npm run build
    
    if %errorlevel% equ 0 (
        echo ✅ Emergency build succeeded!
    ) else (
        echo ❌ Emergency build also failed.
        echo 📝 Manual solutions:
        echo 1. Check BUILD_FIX_GUIDE.md
        echo 2. Try: npx vite build --config vite.config.emergency.mjs
        echo 3. Check browser console for specific error details
        exit /b 1
    )
)

pause
