'use server';

import {EventModel} from "@/database/event.model";
import {connectToDatabase} from "@/lib/mongodb";


export const getEventBySlug = async (slug: string) => {
    try {
        await connectToDatabase();
        const event = await EventModel.findOne({ slug }).lean();
        return event;
    } catch {
        return null;
    }
};

export const getSimilarEventsBySlug = async (slug : string) =>{
    try{
        await connectToDatabase();

        const event = await EventModel.findOne({slug});

        if (!event) return [];

        return await EventModel.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags }
        }).lean();


    }catch{
        return [];
    }
}