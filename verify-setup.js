#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 DaxSeal Setup Verification\n');

let allGood = true;

const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(backendEnvPath)) {
  console.log('✅ Backend .env file exists');
  const content = fs.readFileSync(backendEnvPath, 'utf8');
  if (content.includes('PORT=')) console.log('   ✓ PORT configured');
  if (content.includes('FRONTEND_URL=')) console.log('   ✓ FRONTEND_URL configured');
  if (content.includes('NODE_ENV=')) console.log('   ✓ NODE_ENV configured');
} else {
  console.log('❌ Backend .env file missing');
  allGood = false;
}

console.log('');

const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
if (fs.existsSync(frontendEnvPath)) {
  console.log('✅ Frontend .env file exists');
  const content = fs.readFileSync(frontendEnvPath, 'utf8');
  if (content.includes('VITE_API_URL=')) console.log('   ✓ VITE_API_URL configured');
} else {
  console.log('❌ Frontend .env file missing');
  allGood = false;
}

console.log('');

const backendNodeModules = path.join(__dirname, 'backend', 'node_modules');
if (fs.existsSync(backendNodeModules)) {
  console.log('✅ Backend dependencies installed');
} else {
  console.log('⚠️  Backend dependencies not installed');
  console.log('   Run: cd backend && npm install');
  allGood = false;
}

console.log('');

const frontendNodeModules = path.join(__dirname, 'frontend', 'node_modules');
if (fs.existsSync(frontendNodeModules)) {
  console.log('✅ Frontend dependencies installed');
} else {
  console.log('⚠️  Frontend dependencies not installed');
  console.log('   Run: cd frontend && npm install');
  allGood = false;
}

console.log('');
console.log('─'.repeat(50));

if (allGood) {
  console.log('✅ All checks passed! You\'re ready to go!');
  console.log('\nStart the application:');
  console.log('  Terminal 1: cd backend && npm run dev');
  console.log('  Terminal 2: cd frontend && npm run dev');
} else {
  console.log('⚠️  Some issues found. Please fix them and run again.');
  console.log('\nQuick fix:');
  console.log('  cd backend && npm install');
  console.log('  cd frontend && npm install');
}

console.log('');
