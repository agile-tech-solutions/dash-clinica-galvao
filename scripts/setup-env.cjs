/**
 * Setup script to hash password and prepare environment variables
 * Run with: node scripts/setup-env.js
 */

const bcrypt = require('bcryptjs');

async function setupCredentials() {
  const username = 'admin-sastrairi';
  const plainPassword = 'admin12#';

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  console.log('='.repeat(60));
  console.log('CREDENTIAL SETUP');
  console.log('='.repeat(60));
  console.log('\nAdd these to your .env file:\n');
  console.log(`VITE_ADMIN_USERNAME=${username}`);
  console.log(`VITE_ADMIN_PASSWORD=${plainPassword}`);
  console.log(`VITE_ADMIN_PASSWORD_HASH=${hashedPassword}`);
  console.log('\n' + '='.repeat(60));
  console.log('\nNOTE: Keep the plain password in .env for development.');
  console.log('In production, use only the hashed password and verify with bcrypt.');
  console.log('='.repeat(60));
}

setupCredentials().catch(console.error);
