import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/mongodb";
import {EventModel} from "@/database/event.model";
import {v2 as cloudinary} from "cloudinary";

export async  function POST(req: NextRequest) {
    try{
        await connectToDatabase();

        const formData = await req.formData();

        let event;

        try{
            event = Object.fromEntries(formData.entries());
        }catch (err){
            return  NextResponse.json({message: 'Invalid Json data format'}, {status: 400})
        }

        const file = formData.get('image') as File;

        if(!file) return NextResponse.json({message: 'Image file is required'}, {status: 400});

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({resource_type : 'image', folder: 'DevEvent'},(error, result) => {
                    if(error) return reject(error);
                    resolve(result);
                }).end(buffer);
        })

        event.image = (uploadResult as {secure_url : string } ).secure_url;

        const createdEvent = await EventModel.create(event);

        return NextResponse.json({message : 'Event created successfully.', event : createdEvent},{status : 201});
    }catch(err){
        console.error(err);
        return NextResponse.json({message: 'event creation failed', error: err instanceof Error ? err.message : 'Unknow'}, {status : 500});
    }
}