import { Router } from 'express';
import { createUser, listUsers } from '../../controllers/userController.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireRoles } from '../../middleware/requireRoles.js';
import { createUserSchema } from '../../validators/userValidators.js';
import { ACCOUNT_MANAGER_ROLES } from '../../constants/roles.js';

const router = Router();

// Admin-create only (docs/permissions_matrix.txt); no public registration in Phase 1.
router.use(requireAuth, requireRoles(ACCOUNT_MANAGER_ROLES));

router.post('/', validate(createUserSchema), createUser);
router.get('/', listUsers);

export default router;
