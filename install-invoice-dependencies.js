#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Installing Invoice Management System Dependencies...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from your project root.');
  process.exit(1);
}

try {
  // Install required dependencies
  console.log('📦 Installing @radix-ui/react-select...');
  execSync('npm install @radix-ui/react-select', { stdio: 'inherit' });
  
  console.log('\n✅ Dependencies installed successfully!');
  
  // Check if .env.local exists and has the required variable
  const envPath = '.env.local';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (!envContent.includes('NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID')) {
      console.log('\n⚠️  Warning: NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID not found in .env.local');
      console.log('   Please add this environment variable with your Appwrite collection ID.');
    } else {
      console.log('\n✅ Environment variable found in .env.local');
    }
  } else {
    console.log('\n⚠️  Warning: .env.local file not found');
    console.log('   Please create this file and add NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID');
  }
  
  console.log('\n🎉 Invoice Management System is ready!');
  console.log('\nNext steps:');
  console.log('1. Create the "invoices" collection in Appwrite (see INVOICE_SETUP.md)');
  console.log('2. Update NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID in .env.local');
  console.log('3. Restart your development server');
  console.log('4. Visit /invoice-demo to test the system');
  console.log('5. Access invoice management through the admin dashboard');
  
} catch (error) {
  console.error('\n❌ Error installing dependencies:', error.message);
  console.log('\nPlease install manually:');
  console.log('npm install @radix-ui/react-select');
  process.exit(1);
}
