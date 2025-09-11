/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import * as complaintService from '../services/complaintServices';

// Helper to handle service responses
const handleServiceResponse = (serviceResponse: { data: any; error: any; }, res: Response, next: NextFunction) => {
    if (serviceResponse.error) {
        return next(serviceResponse.error);
    }
    res.status(200).json(serviceResponse.data);
};

// Resident: Create a new complaint
export const createNewComplaint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description } = req.body;
        const complaintData = {
            user_id: req.user!.id, // We get the user ID from the auth middleware
            title,
            description,
        };

        // Call the service with just the data. The service will use its admin rights.
        const { data, error } = await complaintService.createComplaint(complaintData);
        if (error) throw error;
        
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
};

// Resident: Get their own complaints
export const getMyComplaints = async (req: Request, res: Response, next: NextFunction) => {
    const response = await complaintService.findComplaintsByUserId(req.user!.id);
    handleServiceResponse(response, res, next);
};

// Any authenticated user (with logic to check ownership if not admin/staff)
export const getComplaintDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const response = await complaintService.findComplaintById(id);
        
        if (response.error) throw response.error;

        // Add extra logic here to ensure a resident can only see their own complaint
        if (req.user?.role === 'resident' && response.data?.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You can only view your own complaints.' });
        }
        
        res.status(200).json(response.data);
    } catch (error) {
        next(error);
    }
};

// Owner: Get all complaints, with optional status filter
export const getAllComplaints = async (req: Request, res: Response, next: NextFunction) => {
    const status = req.query.status as string | undefined;
    const response = await complaintService.findAllComplaints(status);
    handleServiceResponse(response, res, next);
};

// Owner: Assign a complaint to a staff member
export const assignComplaint = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { staffId } = req.body;
    const response = await complaintService.assignComplaintToStaff(id, staffId);
    handleServiceResponse(response, res, next);
};

// Owner/Staff: Update complaint status
export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;
    const response = await complaintService.updateComplaintStatus(id, status);
    handleServiceResponse(response, res, next);
};

// Staff: Get complaints assigned to them
export const getAssignedComplaints = async (req: Request, res: Response, next: NextFunction) => {
    const response = await complaintService.findComplaintsByAssignedTo(req.user!.id);
    handleServiceResponse(response, res, next);
};
