import {Request, Response} from 'express';
import supabase from '../config/supabase';

export const bookservice = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const { serviceId, bookingDate, details } = req.body as { serviceId?: string, bookingDate?: string, details?: string  };

        if (!userId) {
            return res.status(400).json({ message: "Missing requesting user id in route params (:id)" });
        }
        if (!serviceId || !bookingDate) {
            return res.status(400).json({ message: "Missing serviceId or bookingDate in request body" });
        }
        
        const { data, error } = await supabase
            .from("bookings")
            .insert({ 'user_id':userId, 
                'service_id': serviceId,
                'requested_date': bookingDate })
            .select("*");

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(201).json({ message: "Service booked successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};

export const editbooking = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const { bookingId, bookingDate } = req.body as { bookingId?: string, bookingDate?: string };
        if (!userId) {
            return res.status(400).json({ message: "Missing requesting user id in route params (:id)" });
        }
        if (!bookingId || !bookingDate) {
            return res.status(400).json({ message: "Missing bookingId or bookingDate in request body" });
        }

        const { data, error } = await supabase
            .from("bookings")
            .update({ 'requested_date': bookingDate })
            .eq("id", bookingId)
            .select("*");

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(200).json({ message: "Booking updated successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};

export const cancelbooking = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const { bookingId } = req.body as { bookingId?: string  };
        if (!userId) {
            return res.status(400).json({ message: "Missing requesting user id in route params (:id)" });
        }
        if (!bookingId) {
            return res.status(400).json({ message: "Missing bookingId in request body" });
        }
        const { data, error } = await supabase
            .from("bookings")
            .delete()
            .eq("id", bookingId)
            .select("*");

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(200).json({ message: "Booking cancelled successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};

export const fetchbookings = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from("bookings")
            .select("*");

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(200).json({ message: "Bookings fetched successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};