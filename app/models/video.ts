import mongoose ,{Schema,model,models}from "mongoose";

export const  IVideo_Dim={
     width:1080,
	 height:1920,

}as const ;

export interface IVideo{
	_id?:mongoose.Types.ObjectId;
	tittle:string;
	description:string;
	video_url:string;
	thumbnails_url:string;
	controls?:boolean;
	transformation?:{
		height:number;
		wiedth:number;
		quality?:number
	};
}

const videoSchema=new Schema<IVideo>({
             tittle:{
				type:String,
				required:true,
			 },
			 description:{
				type:String,
			 },
			 video_url:{
				type:String,
				required:true,
			 },
			 thumbnails_url:{
				type:String,
			 },
			 controls:{
				type:Boolean,
				default:true
			 },
			 transformation:{
				height:{
					type:Number,
					default: IVideo_Dim.height
				},
				wiedth:{
					type:Number,
					default:IVideo_Dim.width,
				},
				quality:{
					type:Number,
					min:1,
					max:100
				}
			 }

			 
},{timestamps:true})

const Video= models?.Video || model<IVideo>("Video",videoSchema)
export default Video;