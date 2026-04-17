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

        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({resource_type : 'image', folder: 'DevEvent'},(error, result) => {
                    if(error) return reject(error);
                    resolve(result);
                }).end(buffer);
        })

        event.image = (uploadResult as {secure_url : string } ).secure_url;

        const createdEvent = await EventModel.create({
            ...event,
            tags : tags,
            agenda : agenda
    });

        return NextResponse.json({message : 'Event created successfully.', event : createdEvent},{status : 201});
    }catch(err){
        console.error(err);
        return NextResponse.json({message: 'events creation failed', error: err instanceof Error ? err.message : 'Unknow'}, {status : 500});
    }
}

export async function GET(){
    try{
        await connectToDatabase();

        const events = await EventModel.find().sort({createdAt: -1});

        return NextResponse.json({message : 'Event fetched successfully', events}, {status : 200});
    }catch(err){
        return NextResponse.json({message: 'Event fetching failed', error: err},{status : 404});
    }
}