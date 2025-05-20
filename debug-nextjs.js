// Simple script to debug Next.js configuration
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===== Next.js Debug Info =====');

// Check Node version
console.log('\nNode version:');
console.log(process.version);

// Check if next.config.js exists
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
console.log('\nChecking for next.config.js:');
if (fs.existsSync(nextConfigPath)) {
  console.log('next.config.js exists');
  console.log('Content:');
  console.log(fs.readFileSync(nextConfigPath, 'utf8'));
} else {
  console.log('next.config.js does NOT exist!');
}

// Check if .next directory exists
const nextDirPath = path.join(process.cwd(), '.next');
console.log('\nChecking for .next directory:');
if (fs.existsSync(nextDirPath)) {
  console.log('.next directory exists');
  
  // List files in .next
  console.log('Files in .next:');
  const files = fs.readdirSync(nextDirPath);
  files.forEach(file => {
    console.log(`- ${file}`);
  });
} else {
  console.log('.next directory does NOT exist!');
}

// Check for common Next.js directories
console.log('\nChecking for app directory:');
const appDirPath = path.join(process.cwd(), 'app');
if (fs.existsSync(appDirPath)) {
  console.log('app directory exists');
  console.log('Files:');
  fs.readdirSync(appDirPath).forEach(file => {
    console.log(`- ${file}`);
  });
} else {
  console.log('app directory does NOT exist!');
}

// Check for react and next in node_modules
console.log('\nChecking if Next.js is installed:');
const nextModulePath = path.join(process.cwd(), 'node_modules', 'next');
if (fs.existsSync(nextModulePath)) {
  console.log('Next.js is installed in node_modules');
} else {
  console.log('Next.js is NOT installed in node_modules!');
}

// Attempt to list npx next commands
console.log('\nAttempting to run npx next:');
try {
  const npxOutput = execSync('npx next -v', { encoding: 'utf8' });
  console.log(npxOutput);
} catch (error) {
  console.log('Error running npx next:');
  console.log(error.message);
}

console.log('\n===== End Debug Info ====='); 