import {Router} from "express";
import { createpolls, editpoll, closepoll } from "../controllers/pollController";

const router = Router(); 

router.post('/api/:id/createpoll', createpolls);
router.put('/api/:id/editpoll', editpoll);
router.put('/api/:id/closepoll', closepoll);

export default router;