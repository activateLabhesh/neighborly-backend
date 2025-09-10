import {Router} from "express";
import { createpolls, editpoll, closepoll, getpolls } from "../controllers/pollController";
import { authenticate } from "../middleware/authMiddleware";
const router = Router(); 

router.post('/createpoll',authenticate ,createpolls);
router.put('/editpoll', authenticate, editpoll);
router.put('/closepoll', authenticate, closepoll);
router.get('/getpolls', getpolls);

export default router;