import supabase from '../config/supabase';

export const createComplaint = async (complaintData: { user_id: string; title: string; description?: string; image_url?: string; }) => {
    // 1. Get the society_id from the user's profile
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('society_id')
        .eq('id', complaintData.user_id)
        .single();

    if (profileError || !profileData) {
        throw new Error('Could not find user profile to determine society.');
    }

    // 2. Add the society_id to the data being inserted
    const dataToInsert = {
        ...complaintData,
        society_id: profileData.society_id,
    };

    // 3. Insert the complete complaint data
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