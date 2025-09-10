import { Request, Response } from 'express';
import * as authService from '../services/authServices';
import supabase from '../config/supabase';

export const registerOwner = async (req: Request, res: Response) => {
    const { email, password, fullName, societyName, address } = req.body;
    if (!email || !password || !fullName || !societyName) {
        return res.status(400).json({ message: 'Missing required fields for owner registration.' });
    }
    try {
        const result = await authService.createOwnerAndSociety(email, password, fullName, societyName, address);
        res.status(201).json(result);
    } catch (error) {
        res.status(409).json({ message: (error as Error).message });
    }
};

export const registerResident = async (req: Request, res: Response) => {
    const { email, password, fullName, societyCode, flatNo } = req.body;
    if (!email || !password || !fullName || !societyCode || !flatNo) {
        return res.status(400).json({ message: 'Missing required fields for resident registration.' });
    }
    try {
        const result = await authService.createResident(email, password, fullName, societyCode, flatNo);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const registerStaff = async (req: Request, res: Response) => {
    const { email, password, fullName, societyCode } = req.body;
    if (!email || !password || !fullName || !societyCode) {
        return res.status(400).json({ message: 'Missing required fields for staff registration.' });
    }
    try {
        const result = await authService.createStaff(email, password, fullName, societyCode);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const { data, error } = await authService.loginUser(email, password);

        if (error) {
            throw error;
        }

        if (!data.session) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.cookie('access_token', data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/',
        });

        res.status(200).json({ message: 'Logged in successfully', user: data.user });
    } catch (error) {
        res.status(401).json({ message: (error as Error).message });
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
