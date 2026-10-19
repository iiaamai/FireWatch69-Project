import 'dotenv/config';
import { connectDb, disconnectDb } from '../src/config/db.js';
import { getEnv } from '../src/config/env.js';
import { User } from '../src/models/User.js';
import { hashPassword } from '../src/utils/password.js';
import { ROLES, ACCOUNT_STATUS } from '../src/constants/roles.js';

// Development-only bootstrap for the first system_admin (docs/seed_plan.txt).
// Idempotent: upserts by email. Do not run against production data.
async function seedAdmin() {
  const { isProd } = getEnv();
  if (isProd && process.env.ALLOW_PROD_SEED !== 'true') {
    throw new Error('Refusing to seed in production without ALLOW_PROD_SEED=true');
  }

  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@firewatch69.local').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const fullName = process.env.SEED_ADMIN_NAME || 'System Admin';

  await connectDb();

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    await disconnectDb();
    return;
  }

  const passwordHash = await hashPassword(password);
  await User.create({
    fullName,
    email,
    passwordHash,
    role: ROLES.SYSTEM_ADMIN,
    accountStatus: ACCOUNT_STATUS.ACTIVE,
  });

  console.log(`Seeded system_admin: ${email}`);
  console.log('Remember to change the seeded password after first login.');
  await disconnectDb();
}

seedAdmin().catch(async (err) => {
  console.error('Seed failed:', err.message);
  await disconnectDb().catch(() => {});
  process.exit(1);
});
