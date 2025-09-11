import {Router} from 'express'
import { createnotice, editnotice, deletenotice,fetchnotices } from '../controllers/noticeController';
import { authenticate } from '../middleware/authMiddleware';
const router = Router();

router.post('/createnotice', authenticate, createnotice);
router.put('/editnotice', authenticate, editnotice);
router.delete('/deletenotice', authenticate, deletenotice);
router.get('/fetchnotices', fetchnotices);

export default router;