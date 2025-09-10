import { Router } from 'express';
import * as controller from '../controllers/authController';

const router = Router();

// Registration Routes
router.post('/register/owner', controller.registerOwner);
router.post('/register/resident', controller.registerResident);
router.post('/register/staff', controller.registerStaff);

// Login Route
router.post('/login', controller.login);

export default router;
