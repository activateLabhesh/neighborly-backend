import  supabase  from "../config/supabase";
import { Response, Request } from "express";


export const createnotice = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const { title, content, category } = req.body as { title?: string, content?: string, category?: string  };

        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }
        if (!title || !content || !category) {
            return res.status(400).json({ message: "Missing title, content or category in request body" });
        }
        
        const { data, error } = await supabase
            .from("notices")
            .insert({ 'title':title, 
                'content': content,
                'category': category
            })
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
            return res.status(401).json({ message: "Authentication required" });
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
            return res.status(401).json({ message: "Authentication required" });
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
            return res.status(401).json({ message: "Authentication required" });
        }

        const { data, error } = await supabase
            .from("notices")
            .select("id,title,content,category,created_at")
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