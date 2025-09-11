import {Request, Response} from 'express'
import supabase from '../config/supabase'


export const addemergencyservice = async (req: Request, res: Response) => {
    const {servicetype, description, available_units} = req.body;
    if(!servicetype || !description || !available_units) {
        return res.status(400).json({message: "All fields are required"});
    }
    try {
        const {data, error} = await supabase
            .from('emergency_services')
            .insert([{"servicetype": servicetype, "description": description, "available_units": available_units}])
            .select();
        if(error) {
            return res.status(500).json({message: error.message});
        }
        return res.status(201).json({message: "Emergency service added successfully", data});
    } catch (error) {
        return res.status(500).json({message: "Server error"});
    }
};

export const deleteemergencyservice = async (req: Request, res: Response) => {
    const {id} = req.body;
    if(!id) {
        return res.status(400).json({message: "Service ID is required"});
    }
    try {
        const {data, error} = await supabase
            .from('emergency_services')
            .delete()
            .eq('id', id)
            .select();
        if(error) {
            return res.status(500).json({message: error.message});
        }
        if(data.length === 0) {
            return res.status(404).json({message: "Service not found"});
        }
        return res.status(200).json({message: "Emergency service deleted successfully", data});
    } catch (error) {
        return res.status(500).json({message: "Server error"});
    }
};

export const getemergencyservices = async (req: Request, res: Response) => {
    try {
        const {data:getservices, error: fetchingerror} = await supabase
            .from("emergency_services")
            .select("*");
        if(fetchingerror) {
            return res.status(500).json({message: fetchingerror.message});
        }
        return res.status(200).json({message: "Emergency services fetched successfully", data: getservices});
    } catch (error) {
        return res.status(500).json({message: "Server error"});
    }
};