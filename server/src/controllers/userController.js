import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.js';
import { hashPassword } from '../utils/password.js';

export const createUser = asyncHandler(async (req, res) => {
  const { password, ...rest } = req.body;
  const passwordHash = await hashPassword(password);

  const user = await User.create({ ...rest, passwordHash });

  res.status(201).json({
    success: true,
    data: { user: user.toSafeJSON() },
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: { users: users.map((user) => user.toSafeJSON()) },
  });
});
