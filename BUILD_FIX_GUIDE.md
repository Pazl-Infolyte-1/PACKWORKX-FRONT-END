# Build Error Fix Guide

## Problem
Getting "xV is not a function" error in production build while working fine locally.

## Root Causes
1. React 19 compatibility issues with some packages
2. Missing React imports in context files
3. Vite build optimization conflicts
4. Import/export mismatches

## Solutions Applied

### 1. Fixed React Imports
- Added explicit React imports to SearchContext.js and AuthContext.js
- Fixed export/import mismatch in AppSideBarNew component

### 2. Updated Vite Configuration
- Added manual chunks for better code splitting
- Improved optimization settings
- Added JSX automatic transformation
- Excluded problematic Syncfusion dependencies

### 3. Downgraded React Version
- Changed from React 19.0.0 to 18.3.1 for better compatibility
- Updated react-dom to match

### 4. Added Build Scripts
- `npm run build:clean` - Clean build
- `npm run build:fix` - Run fixes and clean build

## Step-by-Step Fix Process

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Fix Script**
   ```bash
   node fix-build.js
   ```

3. **Clean Build**
   ```bash
   npm run build:clean
   ```

4. **Test Production Build**
   ```bash
   npm run serve
   ```

## If Issues Persist

### Check for these common problems:

1. **Node Modules Cache**: Delete node_modules and package-lock.json, then reinstall
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Vite Cache**: Clear Vite cache
   ```bash
   npx vite --force
   ```

3. **Check Browser Console**: Look for specific error messages and module names

4. **Verify Environment**: Ensure production server has same Node.js version

### Additional Debugging

1. **Enable Source Maps** (temporarily for debugging):
   Add to vite.config.mjs:
   ```javascript
   build: {
     sourcemap: true,
     // ... other options
   }
   ```

2. **Check Network Tab**: Verify all chunks are loading correctly

3. **Bundle Analysis**: Run `npm run analyze` to check bundle structure

## Common Error Patterns

- `xV is not a function` → Import/export mismatch
- `Cannot read property of undefined` → Missing dependency
- `Module not found` → Path resolution issue
- `Unexpected token` → JSX/ES6 compatibility issue

## Prevention

1. Always use explicit React imports in context files
2. Use default exports consistently
3. Test production builds before deployment
4. Keep dependencies up to date but test thoroughly
5. Use stable React versions for production

## Server Deployment Notes

1. Ensure static file serving is configured correctly
2. Set proper MIME types for .js and .css files
3. Enable gzip compression
4. Set appropriate cache headers
5. Handle client-side routing with proper fallback to index.html
