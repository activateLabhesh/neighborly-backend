import {Router} from 'express'
import * as service from '../controllers/serviceController'


const router = Router();

router.post('/createservice' , service.createservice);
router.put('/updateservice', service.editservice);
router.delete('/deleteservice', service.deleteservice);
router.get('/fetchservices',service.fetchservices);

export default router;