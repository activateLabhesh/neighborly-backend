import { Router } from 'express';
import * as controller from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/register/owner', controller.registerOwner);
router.post('/register/resident', controller.registerResident);
router.post('/register/staff', controller.registerStaff);
router.post('/login', controller.login);
router.post('/logout', authenticate, controller.logout);

export default router;
