import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { User } from '../models/User.js';
import { verifyPassword } from '../utils/password.js';
import { signAccessToken } from '../utils/token.js';
import { ACCOUNT_STATUS } from '../constants/roles.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // passwordHash is select:false, so request it explicitly.
  const user = await User.findOne({ email }).select('+passwordHash');

  const ok = user && (await verifyPassword(password, user.passwordHash));
  if (!ok) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.accountStatus !== ACCOUNT_STATUS.ACTIVE) {
    throw new AppError('Account is not active', 403);
  }

  const accessToken = signAccessToken(user);
  res.status(200).json({
    success: true,
    data: { accessToken, user: user.toSafeJSON() },
  });
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user.toSafeJSON() },
  });
});
