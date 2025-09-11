import {Router} from 'express';
import * as emergencycontroller from '../controllers/emergenciesController';

const router = Router();

router.post('/addemergencyservice', emergencycontroller.addemergencyservice);
router.delete('/deleteemergencyservice', emergencycontroller.deleteemergencyservice);
router.get('/getemergencyservices', emergencycontroller.getemergencyservices);

export default router;