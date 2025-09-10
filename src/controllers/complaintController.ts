import { Request, Response } from 'express';
import * as complaintService from '../services/complaintServices';

// Helper to handle service responses
const handleServiceResponse = (serviceResponse: { data: any; error: any; }, res: Response) => {
    if (serviceResponse.error) {
        return res.status(400).json({ message: serviceResponse.error.message });
    }
    res.status(200).json(serviceResponse.data);
};

// Resident: Create a new complaint
export const createNewComplaint = async (req: Request, res: Response) => {
    const { title, description, image_url } = req.body;
    const user_id = req.user!.id;
    const response = await complaintService.createComplaint({ user_id, title, description, image_url });
    if (response.error) return res.status(400).json({ message: response.error.message });
    res.status(201).json(response.data);
};

// Resident: Get their own complaints
export const getMyComplaints = async (req: Request, res: Response) => {
    const response = await complaintService.findComplaintsByUserId(req.user!.id);
    handleServiceResponse(response, res);
};

// Any authenticated user (with logic to check ownership if not admin/staff)
export const getComplaintDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await complaintService.findComplaintById(id);
    // Add extra logic here to ensure a resident can only see their own complaint
    if (req.user?.role === 'resident' && response.data?.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You can only view your own complaints.' });
    }
    handleServiceResponse(response, res);
};

// Admin: Get all complaints, with optional status filter
export const getAllComplaints = async (req: Request, res: Response) => {
    const status = req.query.status as string | undefined;
    const response = await complaintService.findAllComplaints(status);
    handleServiceResponse(response, res);
};

// Admin: Assign a complaint to a staff member
export const assignComplaint = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { staffId } = req.body;
    const response = await complaintService.assignComplaintToStaff(id, staffId);
    handleServiceResponse(response, res);
};

// Admin/Staff: Update complaint status
export const updateStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    // Add logic here to restrict status changes for staff (e.g., only in_progress -> resolved)
    const response = await complaintService.updateComplaintStatus(id, status);
    handleServiceResponse(response, res);
};

// Staff: Get complaints assigned to them
export const getAssignedComplaints = async (req: Request, res: Response) => {
    const response = await complaintService.findComplaintsByAssignedTo(req.user!.id);
    handleServiceResponse(response, res);
};
