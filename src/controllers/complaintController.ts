
/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import * as complaintService from '../services/complaintServices';
import supabase from '../config/supabase';
import Busboy from 'busboy';
// Helper to handle service responses
const handleServiceResponse = (serviceResponse: { data: any; error: any; }, res: Response) => {
    if (serviceResponse.error) {
        return res.status(400).json({ message: serviceResponse.error.message });
    }
    res.status(200).json(serviceResponse.data);
};

// Resident: Create a new complaint


// Resident: Create a new complaint (UPDATED with Busboy)
export const createNewComplaint = async (req: Request, res: Response) => {
    const busboy = Busboy({ headers: req.headers });
    const user_id = req.user!.id;

    const fields: { [key: string]: string } = {};
    let uploadPromise: Promise<string | null> | null = null;

    // Listen for non-file fields
    busboy.on('field', (fieldname, val) => {
        fields[fieldname] = val;
    });

    // Listen for file stream
    busboy.on('file', (fieldname: string, file: NodeJS.ReadableStream, filename: { filename: string }, encoding: string, mimetype: string) => {
        // We only care about the 'image' field from the form
        if (fieldname === 'image') {
            const filePath = `${user_id}/${Date.now()}_${filename.filename}`;

            // Create a promise that resolves with the public URL upon successful upload
            uploadPromise = new Promise(async (resolve, reject) => {
                console.log(`Uploading ${filePath} to Supabase Storage...`);

                const { error: uploadError } = await supabase.storage
                    .from('attachments') // Your bucket name
                    .upload(filePath, file, {
                        contentType: mimetype,
                        upsert: false,
                    });

                if (uploadError) {
                    console.error('Supabase storage error:', uploadError);
                    // The RLS policy for file types will trigger this error
                    return reject(new Error(`Failed to upload image: ${uploadError.message}`));
                }

                // If upload is successful, get the public URL
                const { data: urlData } = supabase.storage
                    .from('attachments')
                    .getPublicUrl(filePath);
                
                console.log(`Successfully uploaded. Public URL: ${urlData.publicUrl}`);
                resolve(urlData.publicUrl);
            });
        } else {
            // If it's not the field we're looking for, consume the stream to avoid hanging
            file.resume();
        }
    });

    // This event fires when all fields and files have been processed.
    busboy.on('finish', async () => {
        try {
            let image_url: string | undefined = undefined;

            // Wait for the file upload to complete if it was initiated
            if (uploadPromise) {
                image_url = (await uploadPromise) ?? undefined;
            }

            const { title, description } = fields;

            // Basic validation
            if (!title) {
                return res.status(400).json({ message: 'Title is a required field.' });
            }

            // Now, call your service to create the database record
            const response = await complaintService.createComplaint({
                user_id,
                title,
                description,
                image_url, // This will be the public URL from storage or undefined
            });

            if (response.error) {
                return res.status(400).json({ message: response.error.message });
            }

            res.status(201).json(response.data);

        } catch (error) {
            // This will catch errors from the uploadPromise rejection (e.g., RLS violation)
            console.error('Error during complaint creation process:', error);
            res.status(500).json({ message: (error as Error).message });
        }
    });

    // Pipe the request stream into busboy to start parsing
    req.pipe(busboy);
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
