/// <reference path="../types/express.d.ts" />
import { Router } from 'express';
import * as controller from '../controllers/complaintController';
import { isOwner, isStaff, isResident } from '../middleware/authMiddleware';

const router = Router();

// Resident Routes
router.post('/', isResident, controller.createNewComplaint);
router.get('/my', isResident, controller.getMyComplaints);

// Staff Routes
router.get('/assigned', isStaff, controller.getAssignedComplaints);

// Admin Routes
router.get('/', isOwner, controller.getAllComplaints);
router.patch('/:id/assign', isOwner, controller.assignComplaint);

// Shared Routes
router.get('/:id', controller.getComplaintDetails); // Authorization handled in controller
router.patch('/:id/status', (req, res, next) => {
    if (req.user?.role === 'owner' || req.user?.role === 'staff') return next();
    return res.status(403).json({ message: 'Forbidden' });
}, controller.updateStatus);


export default router;
