import { Request, Response, NextFunction } from 'express';
import supabase from '../config/supabase';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required.' });
    }

    try {
        // 1. Verify the token with Supabase
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

        // 2. Fetch the user's role from your 'profiles' table
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        // 3. Attach user id and role to the request object
        req.user = {
            id: user.id,
            role: profile.role as 'admin' | 'staff' | 'resident'
        };

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error during authentication.' });
    }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only.' });
    }
    next();
};

export const isStaff = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'staff') {
        return res.status(403).json({ message: 'Forbidden: Staff only.' });
    }
    next();
};

export const isResident = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'resident') {
        return res.status(403).json({ message: 'Forbidden: Residents only.' });
    }
    next();
};
