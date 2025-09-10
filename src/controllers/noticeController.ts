import  supabase  from "../config/supabase";
import { Response, Request } from "express";


export const createnotice = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const { title, content } = req.body as { title?: string, content?: string  };

        if (!userId) {
            return res.status(400).json({ message: "Missing requesting user id in route params (:id)" });
        }
        if (!title || !content) {
            return res.status(400).json({ message: "Missing title or content in request body" });
        }
        
        const { data, error } = await supabase
            .from("notices")
            .insert({ 'title':title, 
                'content': content })
            .select("*");

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(201).json({ message: "Notice created successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};

export const editnotice = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const { noticeId, title, content } = req.body as { noticeId?: string, title?: string, content?: string  };
        
        if (!userId) {
            return res.status(400).json({ message: "Missing requesting user id in route params (:id)" });
        }
        if (!noticeId || !title || !content) {
            return res.status(400).json({ message: "Missing noticeId, title or content in request body" });
        }

        const { data, error } = await supabase

            .from("notices")
            .update({ 'title': title,
                      'content': content
                 })
            .eq("id", noticeId)
            .select("*");

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(200).json({ message: "Notice updated successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};


export const deletenotice = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const { noticeId } = req.body as { noticeId?: string  };

        if (!userId) {
            return res.status(400).json({ message: "Missing requesting user id in route params (:id)" });
        }
        if (!noticeId) {
            return res.status(400).json({ message: "Missing noticeId in request body" });
        }

        const { data, error } = await supabase
            .from("notices")
            .delete()
            .eq("id", noticeId)
            .select("*");

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(200).json({ message: "Notice deleted successfully", data });  
    }
    catch(error){
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({message: errorMessage});
    }
};

export const fetchnotices = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 

        if (!userId) {
            return res.status(400).json({ message: "Missing requesting user id in route params (:id)" });
        }

        const { data, error } = await supabase
            .from("notices")
            .select("title,content")
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ message: error.message });
        }  
        return res.status(200).json({ message: "Notices fetched successfully", data });
    }
    catch(error){
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({message: errorMessage});
    }
};