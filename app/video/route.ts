import { connectToDataBase } from "@/lib/db";
import Video from "../models/video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(){
    try {
	await	connectToDataBase()
	  const videoes=await Video.find({}).sort({createdAt:-1}).lean()
	  if(!videoes || videoes.length==0){
		return NextResponse.json({message:"no video is found"},{status:200});
	  }
	  return NextResponse.json({videoes},{status:200})

	} catch (error) {
		return NextResponse.json({error:"error in fetching videoses "});
	}
}


export async function POST(request:NextRequest){
	try {
	const session=	await getServerSession(authOptions);
	if(!session){
		return NextResponse.json({error:"unauthorize user "},{status:401});
	}
	await connectToDataBase();
	const body=await request.json()
        if(! body.tittle || ! body.description || ! body.video_url || ! body.thumbnails_url ){
			return NextResponse.json({error:"please provide correct way of upload "},{status:400});
		}   
		const videodata={
			...body,
			controls :body?.controls ?? true ,
			transformation :{
				height :1920,
				width :1080,
				quality: body?.transformation?.quality ?? 100
			}
		}
		const newVideo=await Video.create(videodata);
		return NextResponse.json({newVideo},{status:201});  
	} catch (error) {
		console.log('error in the app/video/routes.ts');
		return NextResponse.json({error:"intrnal server error"})
	}
}