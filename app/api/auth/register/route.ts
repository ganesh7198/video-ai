import { connectToDataBase } from "@/lib/db";
import User from "@/app/models/user";
import { NextRequest,NextResponse } from "next/server";
import { userSchema } from "@/app/schemas/user.schema";


export async function POST(request : NextRequest){
	try{
        const dataBody= await request.json();
		if(!dataBody.email || !dataBody.password){
			return  NextResponse.json({error:"email and password are required" },{ status:400})
		}
		const userData=userSchema.safeParse(dataBody)
		if(! userData.success){
            return NextResponse.json(
    {
        errors: userData.error.issues
    },
    { status: 400 }
);
		}
		const validatedUserData=userData.data;
		await connectToDataBase();
		const existingUser=await User.findOne({email:validatedUserData.email});
		if(existingUser){
			return NextResponse.json({error:"User is already existed"},{status:400})
		}

	   await User.create({
           email : validatedUserData.email,
		   password: validatedUserData.password
		})
		return NextResponse.json({message:"user created sucessfully"},{status:201})

	}catch(error){
		console.log(  "eror in the signup ",error)
        return NextResponse.json({error:"internal server error"},{status:500})
	}
}

