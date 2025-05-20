#!/bin/sh
# Debug script to check the Next.js build process

echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

echo "\nChecking for .next directory:"
if [ -d ".next" ]; then
  echo ".next directory exists with the following content:"
  ls -la .next
  
  echo "\nChecking .next/build-manifest.json:"
  if [ -f ".next/build-manifest.json" ]; then
    echo "build-manifest.json exists"
    cat .next/build-manifest.json | head -20
  else
    echo "build-manifest.json does NOT exist!"
  fi
else
  echo ".next directory does NOT exist!"
fi

echo "\nRunning build manually:"
npm run build

echo "\nChecking again for .next directory:"
if [ -d ".next" ]; then
  echo ".next directory exists with the following content:"
  ls -la .next
else
  echo ".next directory STILL does NOT exist!"
fi

echo "\nChecking package.json build script:"
cat package.json | grep build

echo "\nChecking free disk space:"
df -h

echo "\nChecking for errors in the build log:"
npm run build 2>&1 | grep -i error 