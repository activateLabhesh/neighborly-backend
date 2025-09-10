import supabase from '../config/supabase';
import { customAlphabet } from 'nanoid';

//generate society code
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
const formatSocietyCode = (code: string) => `${code.slice(0, 3)}-${code.slice(3)}`;

export const createOwnerAndSociety = async (ownerData: any) => {
    const { email, password, fullName, societyName, address, city, state, postal_code, phone_number } = ownerData;

    // 1. Create the user
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (authError || !authData.user) throw new Error(authError?.message || 'Could not create user.');
    const userId = authData.user.id;

    // 2. Create the owner's profile (without society_id initially)
    const { data: profile, error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        full_name: fullName,
        role: 'owner',
        phone_number
    }).select().single();

    if (profileError) {
        await supabase.auth.admin.deleteUser(userId); // Rollback user creation
        throw profileError;
    }

    // 3. Create the society, linking it to the now-existing profile
    const societyCode = formatSocietyCode(nanoid());
    const { data: society, error: societyError } = await supabase.from('societies').insert({
        name: societyName,
        address,
        city,
        state,
        postal_code,
        owner_id: userId, // This now correctly references an existing profile.id
        society_code: societyCode
    }).select().single();

    if (societyError) {
        // Rollback: delete the profile and the user
        await supabase.from('profiles').delete().eq('id', userId);
        await supabase.auth.admin.deleteUser(userId);
        throw societyError;
    }

    // 4. Update the profile with the new society_id
    const { error: updateProfileError } = await supabase.from('profiles')
        .update({ society_id: society.id })
        .eq('id', userId);

    if (updateProfileError) {
        // Full Rollback: delete society, profile, and user
        await supabase.from('societies').delete().eq('id', society.id);
        await supabase.from('profiles').delete().eq('id', userId);
        await supabase.auth.admin.deleteUser(userId);
        throw updateProfileError;
    }
    
    // Manually add society_id to the returned profile object for a complete response
    const finalProfile = { ...profile, society_id: society.id };

    return { user: authData.user, session: authData.session, profile: finalProfile, society };
};

export const createResident = async (residentData: any) => {
    const { email, password, fullName, societyCode, flatNo, phone_number, move_in_date } = residentData;

    // 1. Find society
    const { data: society, error: societyError } = await supabase.from('societies').select('id').eq('society_code', societyCode).single();
    if (societyError || !society) throw new Error('Invalid society code.');

    // 2. Create user
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (authError || !authData.user) throw new Error(authError?.message || 'Could not create user.');
    const userId = authData.user.id;

    // 3. Create profile with new details
    const { data: profile, error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        full_name: fullName,
        role: 'resident',
        society_id: society.id,
        phone_number
    }).select().single();

    if (profileError) {
        await supabase.auth.admin.deleteUser(userId);
        throw profileError;
    }

    // 4. Create resident_details entry
    const { error: residentDetailsError } = await supabase.from('resident_details').insert({
        profile_id: userId,
        flat_no: flatNo,
        move_in_date
    });

    if (residentDetailsError) {
        await supabase.auth.admin.deleteUser(userId); // Rollback
        throw residentDetailsError;
    }

    return { user: authData.user, session: authData.session, profile };
};

export const createStaff = async (staffData: any) => {
    const { email, password, fullName, societyCode, phone_number, department, job_title } = staffData;

    // 1. Find society
    const { data: society, error: societyError } = await supabase.from('societies').select('id').eq('society_code', societyCode).single();
    if (societyError || !society) throw new Error('Invalid society code.');

    // 2. Create user
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (authError || !authData.user) throw new Error(authError?.message || 'Could not create user.');
    const userId = authData.user.id;

    // 3. Create profile with new details
    const { data: profile, error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        full_name: fullName,
        role: 'staff',
        society_id: society.id,
        phone_number
    }).select().single();

    if (profileError) {
        await supabase.auth.admin.deleteUser(userId);
        throw profileError;
    }

    // 4. Create staff_details entry
    const { error: staffDetailsError } = await supabase.from('staff_details').insert({
        profile_id: userId,
        department,
        job_title
    });

    if (staffDetailsError) {
        await supabase.auth.admin.deleteUser(userId); // Rollback
        throw staffDetailsError;
    }

    return { user: authData.user, session: authData.session, profile };
};

export const loginUser = async (email: string , password: string ) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
};