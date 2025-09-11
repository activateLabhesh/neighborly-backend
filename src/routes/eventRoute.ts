import {Router} from 'express';
import * as eventcontroller from '../controllers/eventController';

const router = Router();

router.post('/addevent', eventcontroller.addevent);
router.delete('/removeevent', eventcontroller.removeevent);
router.get('/fetchevents', eventcontroller.fetchevents);

export default router;