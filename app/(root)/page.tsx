// 'use client'
import { fetchPosts } from "@/lib/actions/thread.action";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { communityTabs } from './../../constant/index';
import ThreadCard from "@/components/cards/ThreadCard";
 
export default async function Home() {
  const user = await currentUser()

  const result = await fetchPosts(1,30);
  console.log(result,"Success")
  return (
    <>
   <h1 className="head-text text-left">Home</h1>
   <section className="mt-10  flex flex-col gap-10">
    {
      result?.posts.length === 0 ? (<p>No threads found</p>) : (<>
      {
        result?.posts.map((post : any) => {
          {console.log(post,">>>>>>")}
          return <ThreadCard
          key = { post._id}
          id = { post._id }
          crrentUserId = {user?.id || ""}
          parentId = {post.parentId}
          content = { post.text }
          author = { post.author }
          community = { post.community }
          comments = { post.children }
          createdAt = { post.createdAt }
          />
        })
      }
      </>)   }
   </section>
    </>
  )
}