import {Router} from 'express'
import { createnotice, editnotice, deletenotice,fetchnotices } from '../controllers/noticeController';
import { authenticate } from '../middleware/authMiddleware';
const route = Router();

route.post('/createnotice', authenticate, createnotice);
route.put('/editnotice', authenticate, editnotice);
route.delete('/deletenotice', authenticate, deletenotice);
route.get('/fetchnotices', fetchnotices);

export default route;