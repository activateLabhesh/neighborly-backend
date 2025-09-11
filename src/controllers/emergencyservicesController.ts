import { Request,Response } from "express";
import supabase from "../config/supabase";


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

export const selectemergencyservice = async (req: Request, res: Response) => {
    const { servicetypeId } = req.body;
    if (!servicetypeId) {
        return res.status(400).json({ message: "Service ID (servicetypeId) is required" });
    }
    try {
        // 1. Fetch current service row
        const { data: service, error: fetchError } = await supabase
            .from('emergency_services')
            .select('id, servicetype, available_units')
            .eq('id', servicetypeId)
            .single();

        if (fetchError) {
            return res.status(500).json({ message: fetchError.message });
        }
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        if ((service.available_units as number) <= 0) {
            return res.status(409).json({ message: 'No available units for this service' });
        }

        // 2. Attempt optimistic decrement (concurrency-safe) by matching previous available_units value
        const previousUnits = service.available_units as number;
        const { data: updatedRows, error: updateError } = await supabase
            .from('emergency_services')
            .update({ available_units: previousUnits - 1 })
            .eq('id', servicetypeId)
            .eq('available_units', previousUnits)
            .select('id, servicetype, available_units');

        if (updateError) {
            return res.status(500).json({ message: updateError.message });
        }
        if (!updatedRows || updatedRows.length === 0) {
            // Someone else modified the row concurrently
            return res.status(409).json({ message: 'Concurrent update detected, please retry.' });
        }

        const updatedService = updatedRows[0];

        // 3. Insert availed service record
        const { data: availed, error: availError } = await supabase
            .from('avail_emergency_services')
            .insert([{ emser_id: servicetypeId, user_id: (req as any).user?.id }])
            .select();

        if (availError) {
            // Rollback decrement (best effort)
            await supabase
                .from('emergency_services')
                .update({ available_units: previousUnits })
                .eq('id', servicetypeId)
                .select('id');
            return res.status(500).json({ message: availError.message });
        }

        return res.status(201).json({
            message: 'Emergency service availed successfully',
            availed,
            service: updatedService
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

export const closeemergencyservice = async (req: Request, res: Response) => {
    const { availed_id } = req.body;
    if (!availed_id) {
        return res.status(400).json({ message: 'Availed emergency id (availed_id) is required.' });
    }
    try {
        // Delete the availed record and return the deleted row(s)
        const { data: closed, error: closingerror } = await supabase
            .from('avail_emergency_services')
            .delete()
            .eq('id', availed_id)
            .select('*');

        if (closingerror) {
            return res.status(500).json({ message: 'Could not close the emergency', error: closingerror.message });
        }
        if (!closed || closed.length === 0) {
            return res.status(404).json({ message: 'Availed emergency not found' });
        }

        const serviceId = closed[0].emser_id;
        if (serviceId) {
            // Increment available units (best effort)
            const { data: serviceRow, error: incError } = await supabase
                .from('emergency_services')
                .select('available_units')
                .eq('id', serviceId)
                .single();
            if (!incError && serviceRow) {
                await supabase
                    .from('emergency_services')
                    .update({ available_units: (serviceRow.available_units as number) + 1 })
                    .eq('id', serviceId)
                    .select('id, available_units');
            }
        }

        return res.status(200).json({ message: 'Emergency service closed successfully', closed });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};