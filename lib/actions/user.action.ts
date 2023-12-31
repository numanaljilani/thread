"use server";

import { FilterQuery, SortOrder } from "mongoose";
import User from "../models/user.model";
import { connectToDB } from "../mongoos";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.models";

interface params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}
export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: params): Promise<void> {
  await connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error("Fialed to update / create user", error.message);
  }
}

export async function fetchUser(userId: string) {
  connectToDB();
  try {
    return User.findOne({ id: userId });
  } catch (error: any) {
    console.log(error);
    throw new Error(`Field to fetch data ${error.messagr}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber: number;
  pageSize: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOption = { createdAt: sortBy };

    const users = await User.find(query)
      .sort(sortOption)
      .skip(skipAmount)
      .limit(pageSize);
      // const users = await users.exec();
    const totalUsers = await User.countDocuments(query);


    const isNext = totalUsers > skipAmount + users.length;
    return { users, isNext };
  } catch (error: any) {
    console.log(error);
    throw new Error(`Field  ${error}`);
  }
}

export async function getActivity(userId : string){
  try {
    connectToDB();
   
    const userThread = await Thread.find({author : userId});


    if(!userThread) return null
    
    const childThreads = userThread.reduce((acc:any,userThread : any)=>{
      return acc.concat(userThread.children);
    },[]);

    const replies = await Thread.find({_id : { $in : childThreads }  })
    .populate({
      path : 'author',
      model : User,
      populate : 'name image _id'
    });

    return replies
  } catch (error) {
    throw new Error(`Field to fetch activity ${error}`);
  }
}
