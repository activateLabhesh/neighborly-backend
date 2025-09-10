import supabase from '../config/supabase';

// Simplified service functions. In a real app, you'd have more robust error handling and data shaping.

export const createComplaint = async (data: { user_id: string; title: string; description?: string; image_url?: string; }) => {
    return supabase.from('complaints').insert(data).select().single();
};

export const findComplaintsByUserId = async (userId: string) => {
    return supabase.from('complaints').select('*').eq('user_id', userId);
};

export const findComplaintById = async (id: string) => {
    return supabase.from('complaints').select('*').eq('id', id).single();
};

export const findAllComplaints = async (status?: string) => {
    let query = supabase.from('complaints').select('*');
    if (status) {
        query = query.eq('status', status);
    }
    return query;
};

export const assignComplaintToStaff = async (complaintId: string, staffId: string) => {
    return supabase.from('complaints').update({ assigned_to: staffId, status: 'in_progress' }).eq('id', complaintId).select().single();
};

export const updateComplaintStatus = async (complaintId: string, status: string) => {
    return supabase.from('complaints').update({ status }).eq('id', complaintId).select().single();
};

export const findComplaintsByAssignedTo = async (staffId: string) => {
    return supabase.from('complaints').select('*').eq('assigned_to', staffId);
};
