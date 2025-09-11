import { SupabaseClient } from '@supabase/supabase-js';
import supabase from '../config/supabase'; // This uses the service_role key

export const createComplaint = async (
    complaintData: { user_id: string; title: string; description?: string; }
) => {
    // STEP 1: As an admin, find the society_id for the user who is creating the complaint.
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('society_id')
        .eq('id', complaintData.user_id)
        .single();

    if (profileError) {
        // This will be caught by the controller and sent as a proper error response.
        throw new Error('Could not find a profile for the user.');
    }

    // STEP 2: Create the complete data object, including the society_id.
    const dataToInsert = {
        ...complaintData,
        society_id: profile.society_id, // Add the required society_id
    };

    // STEP 3: Insert the data. Since we are using the service_role key,
    // this operation bypasses RLS policies.
    return supabase.from('complaints').insert(dataToInsert).select().single();
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

// Admin: Assign a complaint to a staff member
export const assignComplaintToStaff = async (complaintId: string, staffId: string) => {
    const { data, error } = await supabase
        .from('complaints')
        .update({ assigned_to: staffId, status: 'in-progress' })
        .eq('id', complaintId) // You are filtering by a unique ID
        .select()
        .single(); // This line expects exactly ONE row to be returned

    return { data, error };
};

// Admin/Staff: Update a complaint's status
export const updateComplaintStatus = async (complaintId: string, status: string) => {
    return supabase.from('complaints').update({ status }).eq('id', complaintId).select().single();
};

export const findComplaintsByAssignedTo = async (staffId: string) => {
    return supabase.from('complaints').select('*').eq('assigned_to', staffId);
};