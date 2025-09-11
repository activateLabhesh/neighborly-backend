import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authServices';
import supabase from '../config/supabase';

export const registerOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.createOwnerAndSociety(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const registerResident = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.createResident(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const registerStaff = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.createStaff(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const { data, error } = await authService.loginUser(email, password);

        if (error) {
            throw error; // Throw the error to be caught by the catch block
        }

        if (!data.session) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.cookie('access_token', data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Will be true on Render
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-site, 'lax' for local
            path: '/',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        const role = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user?.id)
            .single();

        if (role.error) {
            throw role.error;
        }

        data.user.role = role.data?.role;

        res.status(200).json({ message: 'Logged in successfully', user: data.user });
    } catch (error) {
        next(error);
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
