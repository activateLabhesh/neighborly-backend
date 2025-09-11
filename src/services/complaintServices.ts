import { SupabaseClient } from '@supabase/supabase-js';
import supabase from '../config/supabase'; // Keep for service-role actions if needed

export const createComplaint = async (
    complaintData: { user_id: string; title: string; description?: string; },
    userSupabase: SupabaseClient // Accept the user-specific client
) => {
    const dataToInsert = {
        ...complaintData,
    };

    // Use the passed-in userSupabase client, which respects RLS
    return userSupabase.from('complaints').insert(dataToInsert).select().single();
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