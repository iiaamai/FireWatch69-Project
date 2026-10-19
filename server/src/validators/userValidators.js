import { z } from 'zod';
import { ROLE_VALUES, ACCOUNT_STATUS_VALUES } from '../constants/roles.js';

export const createUserSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(ROLE_VALUES),
  phoneNumber: z.string().trim().optional(),
  accountStatus: z.enum(ACCOUNT_STATUS_VALUES).optional(),
  departmentOrTeam: z.string().trim().optional(),
});
