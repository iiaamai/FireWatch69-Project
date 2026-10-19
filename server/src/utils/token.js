import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env.js';

export function signAccessToken(user) {
  const { jwtAccessSecret, jwtAccessExpiresIn } = getEnv();
  const payload = {
    sub: user._id.toString(),
    role: user.role,
  };
  return jwt.sign(payload, jwtAccessSecret, { expiresIn: jwtAccessExpiresIn });
}

export function verifyAccessToken(token) {
  const { jwtAccessSecret } = getEnv();
  return jwt.verify(token, jwtAccessSecret);
}
