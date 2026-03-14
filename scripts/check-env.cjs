const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

console.log('Checking .env file...');
console.log('Path:', envPath);
console.log('Exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  console.log('\n.env content:');
  console.log(content);

  const lines = content.split('\n');
  const username = lines.find(l => l.startsWith('VITE_ADMIN_USERNAME='));
  const password = lines.find(l => l.startsWith('VITE_ADMIN_PASSWORD='));

  console.log('\nExtracted values:');
  console.log('Username:', username?.split('=')[1]);
  console.log('Password:', password?.split('=')[1]);
} else {
  console.log('\n❌ .env file does not exist!');
  console.log('\nCreating .env file with correct credentials...');

  const envContent = `VITE_ADMIN_USERNAME=admin-sastrairi
VITE_ADMIN_PASSWORD=admin12#
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('\nContent:');
  console.log(envContent);
}
