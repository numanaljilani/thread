import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
    text : { type : String , required: true },
    author : { type : mongoose.Schema.ObjectId , ref : "User" , required: true },
    community : { type : mongoose.Schema.ObjectId , ref : "community"  },
    createdAt : { type : Date , default : Date.now },
    parentId : { type :String },
    children : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Thread"
        }
    ]
})

 const  Thread : any = mongoose.models.Thread || mongoose.model("Thread",threadSchema)

 export default Thread;