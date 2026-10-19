import { AppError } from '../utils/AppError.js';
import { verifyAccessToken } from '../utils/token.js';
import { User } from '../models/User.js';
import { ACCOUNT_STATUS } from '../constants/roles.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Authentication required', 401);
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      throw new AppError('Invalid or expired token', 401);
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      throw new AppError('Invalid or expired token', 401);
    }

    if (user.accountStatus !== ACCOUNT_STATUS.ACTIVE) {
      throw new AppError('Account is not active', 403);
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}
