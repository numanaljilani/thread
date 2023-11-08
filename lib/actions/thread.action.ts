"use server";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.models";
import User from "../models/user.model";
import { connectToDB } from "../mongoos";

interface params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}
export async function createThread({
  text,
  author,
  communityId,
  path,
}: params) {
  connectToDB();

  const createThead = await Thread.create({
    text,
    author,
    community: communityId || null,
  });

  await User.findByIdAndUpdate(author, { $push: { threads: createThead._id } });
  revalidatePath(path);
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
    const skipAmount = (pageNumber - 1) * pageSize;

    const postQuery = await Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: "User" })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: "User",
          select: "_id name parentId image",
        },
      });

    const totalPost = await Thread.countDocuments({
      parent: { $in: [null, undefined, undefined] },
    });

    // const posts = await postQuery.exec()
    const isNext = totalPost > skipAmount + postQuery.length;

    return { posts: postQuery, isNext };
  } catch (error: any) {
    // throw new Error(`error while fetching posts ${error.message}`)
    console.log(`error while fetching posts ${error.message}`);
  }
}

export async function fetchThreadById(id: string) {
  connectToDB();
  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name parentId image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              module: User,
              select: "_id id name parentId image",
            },
          },
        ],
      }).exec();
      return thread;
  } catch (error : any) {
    throw new Error(`error while fetching thread ${error.message}`);
  }
}


export async function addCommentToThread(
  threadId : string, 
  commentText : string, 
  userId : string,
  path : string
){
  connectToDB();
  try {
    const orignalThread = await Thread.findById(threadId);

    if(!orignalThread) throw new Error(`Thread not found`);

    const commentThread = new Thread({ text : commentText , author : userId , parentId : threadId });

    const saveCommentThread = await commentThread.save();

     orignalThread.children.push(saveCommentThread._id);

     await orignalThread.save();
    return ;
  } catch (error : any) {
    throw new Error(`error while adding comment to thread ${error.message}`);
  }
}


export async function getUserPost(userId : string){
  try {
    connectToDB();
    // const userPost = await Thread.find({ author : id })

    const userThreads = await User.findOne({ id :userId }).populate({ path : 'threads' , model : Thread , populate : {
      path : 'children',
      model : Thread,
      populate : {
        path : 'author',
        model : User,
        select : '_id id name  image'
      }
    } });

    return userThreads;
  } catch (error: any) {
    throw new Error(`error while fetching user post ${error.message}`);
    
  }
}