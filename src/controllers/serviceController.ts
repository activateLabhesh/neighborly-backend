import supabase from '../config/supabase';
import {Response, Request} from 'express';

export const createservice = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const { name, description, category } = req.body as { name?: string, description?: string, category?: string  };

        if (!userId) {
            return res.status(400).json({ message: "Missing requesting user id in route params (:id)" });
        }
        if (!name || !description) {
            return res.status(400).json({ message: "Missing name or description in request body" });
        }
        
        const { data, error } = await supabase
            .from("services")
            .insert({ 'name':name, 
                'description': description,
                'category': category })
                .select("*");

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(201).json({ message: "Service created successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};

export const editservice = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const { serviceId, name, description, category } = req.body as { serviceId?: string, name?: string, description?: string, category?: string  };
        
        if (!userId) {
            return res.status(400).json({ message: "Missing requesting user id in route params (:id)" });
        }
        if (!serviceId || !name || !description) {
            return res.status(400).json({ message: "Missing serviceId, name or description in request body" });
        }

        const { data, error } = await supabase

            .from("services")
            .update({ 'name': name,
                      'description': description,
                      'category': category,
                      'created_by': userId
                 })
            .eq("id", serviceId)
            .select("*");

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(200).json({ message: "Service updated successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};

export const deleteservice = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const { serviceId } = req.body as { serviceId?: string  };

        if (!userId) {
            return res.status(400).json({ message: "Missing requesting user id in route params (:id)" });
        }
        if (!serviceId) {
            return res.status(400).json({ message: "Missing serviceId in request body" });
        }

        const { data, error } = await supabase
            .from("services")
            .delete()
            .eq("id", serviceId)
            .select("*");

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(200).json({ message: "Service deleted successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};

export const fetchservices = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from("services")
            .select("*");

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(200).json({ message: "Services fetched successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};  