import { AppError } from '../utils/AppError.js';

// Deny by default: only the listed roles may proceed. Use after requireAuth.
export function requireRoles(...roles) {
  const allowed = roles.flat();
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    if (!allowed.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }
    return next();
  };
}
