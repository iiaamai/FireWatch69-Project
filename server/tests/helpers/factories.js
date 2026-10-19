import { User } from '../../src/models/User.js';
import { hashPassword } from '../../src/utils/password.js';
import { ROLES, ACCOUNT_STATUS } from '../../src/constants/roles.js';

export async function createTestUser(overrides = {}) {
  const {
    password = 'Password123!',
    email = 'user@example.com',
    fullName = 'Test User',
    role = ROLES.REGISTERED_RESIDENT,
    accountStatus = ACCOUNT_STATUS.ACTIVE,
    ...rest
  } = overrides;

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    fullName,
    email,
    passwordHash,
    role,
    accountStatus,
    ...rest,
  });

  return { user, password };
}
