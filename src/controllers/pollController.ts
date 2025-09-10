import supabase from "../config/supabase";
import { Response, Request } from "express";

export const createpolls = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const { question, options } = req.body as { question?: string, options?: string[]  };

        if (!userId) {
            return res.status(400).json({ message: "Missing requesting user id in route params (:id)" });
        }
        if (!question || !options || options.length < 2) {
            return res.status(400).json({ message: "Missing question or at least two options are required" });
        }

        const { data, error } = await supabase

            .from("polls")
            .insert({ 'question':question, 
                'options': options })
            .select("*");

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(201).json({ message: "Poll created successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};

export const editpoll = async(req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const { pollId, question, options } = req.body as { pollId?: string, question?: string, options?: string[]  };
        
        if (!userId) {
            return res.status(400).json({ message: "Missing requesting user id in route params (:id)" });
        }
        if (!pollId || !question || !options || options.length < 2) {
            return res.status(400).json({ message: "Missing pollId, question or insufficient options in request body" });
        }
        
        const {data: edited, error: pollupdateerror} = await supabase
            .from("polls")
            .update({"question": question,
                     "options" : options
            })
            .eq('id', pollId)
            .select('*');
        if(!edited || pollupdateerror){
            return res.json(400).json({message: "There was no poll with the give id"});
        }
        return res.status(200).json({message: "Poll updated succesfully",edited});

    }
    catch(error){
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({message: errorMessage});
    }
};


export const closepoll = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const { pollId } = req.body as { pollId?: string  };

        if (!userId) {
            return res.status(400).json({ message: "Missing requesting user id in route params (:id)" });
        }
        if (!pollId) {
            return res.status(400).json({ message: "Missing pollId in request body" });
        }
        
        const { data, error } = await supabase

            .from("polls")
            .update({ is_active: false })
            .eq("id", pollId)
            .select("*");

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(200).json({ message: "Poll closed successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};

export const getpolls = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from("polls")
            .select("*")
            .eq("is_active", true);

        if (error) {
            return res.status(400).json({ message: error.message });
        }
        else if(data.length === 0){
            return res.status(200).json({ message: "No active polls found" });
        }
        return res.status(200).json({ message: "Active polls fetched successfully", data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ message: errorMessage });
    }
};