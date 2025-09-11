import { Request,Response } from "express";
import supabase from "../config/supabase";


export const addevent = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const { title, description, date } = req.body as { title?: string, description?: string, date?: string  };

        if (!userId) {
            return res.status(400).json({ message: "Missing requesting user id in route params (:id)" });
        }
        if (!title || !description || !date) {
            return res.status(400).json({ message: "Missing title, description or date in request body" });
        }

        const { data: societyData, error: societyError } = await supabase
            .from("societies")
            .select("id")
            .maybeSingle();

        if (societyError || !societyData) {
            return res.status(400).json({ message: "You are not authorized to add events. Only society owners can add events.", details: societyError?.message||societyData });
        }   

        const societyId = societyData.id;

        const { data, error } = await supabase
            .from("events")
            .insert({ 'title':title, 
                'description': description,
                'date': date,
                'society_id': societyId})
            .select("*");

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(201).json({ message: "Event created successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};

export const removeevent = async(req: Request, res: Response) => {
    try{
        const userId = req.user?.id; 
        const { eventId } = req.body as { eventId?: string  };
        if (!userId) {
            return res.status(400).json({ message: "Missing requesting user id in route params (:id)" });}
        if(!eventId){
            return res.status(400).json({ message: "Missing eventId in request body" });
        }

        const { data, error } = await supabase
            .from("events")
            .delete()
            .eq("id", eventId)
            .select("*");

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        return res.status(200).json({ message: "Event removed successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};

export const fetchevents = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from("events")
            .select("title, description, date")
            .order('date', { ascending: true });

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(200).json({ message: "Events fetched successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};