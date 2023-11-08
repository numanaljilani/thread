import mongoose from "mongoose";

let isConnect = false;
export const connectToDB = async () =>{
    mongoose.set('strictQuery',true);
    if(!process.env.MONGODB_URL) return console.log("mongodb url not found");
    if(isConnect) return console.log("already connected");

    try {
        await mongoose.connect(process.env.MONGODB_URL)
        isConnect = true;
    } catch (error) {
        console.log(error , "in db connection")
    }
}