import supabase from '../config/supabase';
import { customAlphabet } from 'nanoid';

//generate society code
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
const formatSocietyCode = (code: string) => `${code.slice(0, 3)}-${code.slice(3)}`;

export const createOwnerAndSociety = async (email: string, password: string, fullName: string, societyName: string, address: string) => {
    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName }
        }
    });

    if (authError || !authData.user) {
        throw new Error(authError?.message || 'Could not create user.');
    }
    const userId = authData.user.id;

    // 2. Create the society
    const societyCode = formatSocietyCode(nanoid());
    const { data: society, error: societyError } = await supabase.from('societies').insert({
        name: societyName,
        address,
        owner_id: userId,
        society_code: societyCode
    }).select().single();

    if (societyError) {
        await supabase.auth.admin.deleteUser(userId);
        throw societyError;
    }

    // 3. Create the user's profile with the 'admin' role
    const { data: profile, error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        full_name: fullName,
        role: 'admin',
        society_id: society.id
    }).select().single();

    if (profileError) {
        await supabase.auth.admin.deleteUser(userId);
        throw profileError;
    }

    return { user: authData.user, session: authData.session, profile, society };
};

export const createResident = async (email: string, password: string, fullName: string, societyCode: string, flatNo: string) => {
    // 1. Find the society by its code
    const { data: society, error: societyError } = await supabase.from('societies').select('id').eq('society_code', societyCode).single();

    if (societyError || !society) {
        throw new Error('Invalid society code.');
    }

    // 2. Create the user
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (authError || !authData.user) throw new Error(authError?.message || 'Could not create user.');

    // 3. Create the resident's profile
    const { data: profile, error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: fullName,
        role: 'resident',
        society_id: society.id,
        flat_no: flatNo
    }).select().single();

    if (profileError) throw profileError;

    return { user: authData.user, session: authData.session, profile };
};

export const createStaff = async (email: string, password: string, fullName: string, societyCode: string) => {
    // 1. Find the society by its code
    const { data: society, error: societyError } = await supabase.from('societies').select('id').eq('society_code', societyCode).single();

    if (societyError || !society) {
        throw new Error('Invalid society code.');
    }

    // 2. Create the user
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (authError || !authData.user) throw new Error(authError?.message || 'Could not create user.');

    // 3. Create the staff's profile
    const { data: profile, error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: fullName,
        role: 'staff',
        society_id: society.id
    }).select().single();

    if (profileError) throw profileError;

    return { user: authData.user, session: authData.session, profile };
};

export const loginUser = async (email: string , password: string ) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
};