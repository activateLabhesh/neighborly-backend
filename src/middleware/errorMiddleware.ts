import { Request, Response, NextFunction } from 'express';
import { AuthError, PostgrestError } from '@supabase/supabase-js';


const isPostgrestError = (error: any): error is PostgrestError => {
    return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('ERROR LOG:', new Date().toISOString());
    console.error('Request:', `${req.method} ${req.originalUrl}`);
    console.error('Error:', err);

    if (err instanceof AuthError) {
        return res.status(err.status || 401).json({
            message: err.message || 'Authentication error.',
            code: 'AUTH_ERROR'
        });
    }

    if (isPostgrestError(err)) {
        switch (err.code) {
            case '23505': // unique_violation
                return res.status(409).json({
                    message: `A record with that value already exists. ${err.details}`,
                    code: 'UNIQUE_VIOLATION'
                });
            case '23503': // foreign_key_violation
                return res.status(400).json({
                    message: `Invalid reference. ${err.details}`,
                    code: 'FOREIGN_KEY_VIOLATION'
                });
            case 'PGRST116': // "Cannot coerce..."
                return res.status(404).json({
                    message: 'The requested resource was not found or you do not have permission to access it.',
                    code: 'NOT_FOUND'
                });
            default:
                return res.status(500).json({
                    message: 'A database error occurred.',
                    details: err.message,
                    code: err.code
                });
        }
    }

    if (err instanceof Error) {
        if (err.message.includes('Invalid society code') || err.message.includes('Could not find user profile')) {
            return res.status(404).json({ message: err.message });
        }
        return res.status(500).json({ message: err.message || 'An unexpected error occurred.' });
    }

    return res.status(500).json({ message: 'An unknown error occurred.' });
};