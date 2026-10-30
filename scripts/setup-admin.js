const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');

// Safely parse local .env.local if present
try {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        if (!process.env[k.trim()]) {
          process.env[k.trim()] = v.join('=').trim();
        }
      }
    });
  }
} catch (_) {}

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (_) {}

const email = (process.argv[2] || process.env.ADMIN_EMAIL || 'saillavenu012@gmail.com').trim().toLowerCase();
const password = process.argv[3] || process.env.ADMIN_PASSWORD || '12345678';
const name = process.argv[4] || 'Ravi Avula (Proprietor)';

const PRIMARY_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/srirama_cycles';
const LOCAL_URI = 'mongodb://127.0.0.1:27017/srirama_cycles';

async function setupAdmin() {
  console.log('🚲 Sri Rama Cycles - Setting up CMS Administrator Account...');
  console.log(`   Admin Email: ${email}`);
  console.log(`   Admin Name:  ${name}`);
  console.log('   Encrypting development password with bcrypt...');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const targets = [PRIMARY_URI];
  if (PRIMARY_URI !== LOCAL_URI) targets.push(LOCAL_URI);

  const UserSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      phone: { type: String, default: '' },
      role: { type: String, default: 'admin' },
    },
    { timestamps: true }
  );

  for (const uri of targets) {
    try {
      console.log(`Connecting to: ${uri.substring(0, 35)}...`);
      const conn = await mongoose.createConnection(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      }).asPromise();

      const UserModel = conn.model('User', UserSchema);

      const updated = await UserModel.findOneAndUpdate(
        { email },
        {
          name,
          email,
          password: hashedPassword,
          role: 'admin',
          phone: '+91 95736 53194',
        },
        { upsert: true, new: true }
      );

      console.log(`✅ Administrator account configured in DB: ${updated.email} (${updated.role})`);
      await conn.close();
    } catch (err) {
      console.warn(`⚠️ Warning connecting to ${uri.substring(0, 35)}: ${err.message}`);
    }
  }

  console.log('\n🎉 Admin account setup complete! You can log in at /admin/login\n');
  process.exit(0);
}

setupAdmin().catch((err) => {
  console.error('Fatal error during admin setup:', err);
  process.exit(1);
});
