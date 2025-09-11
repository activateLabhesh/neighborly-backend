import { Router } from "express";
import * as es from "../controllers/emergencyservicesController"


const router = Router();

router.get('/fetchsemergencyervices',es.getemergencyservices);
router.post('/bookemergencyservice', es.selectemergencyservice);
router.delete('/closeemergencyservice',es.closeemergencyservice);


export default router;