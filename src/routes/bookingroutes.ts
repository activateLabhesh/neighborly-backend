import {Router} from 'express';
import * as bookingController from '../controllers/bookingController';
import { authenticate } from '../middleware/authMiddleware';
const router = Router();

router.post("/book", authenticate, bookingController.bookservice);
router.put("/editbooking", authenticate, bookingController.editbooking);
router.delete("/cancelbooking", authenticate, bookingController.cancelbooking);
router.get("/fetchbooking", authenticate, bookingController.fetchbookings);

export default router;
