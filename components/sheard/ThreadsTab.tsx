import { getUserPost } from '@/lib/actions/thread.action';
import { redirect } from 'next/navigation';
import React from 'react'
import ThreadCard from '../cards/ThreadCard';

interface props {
  currentUserId: string;
  accountId: string;
  accountType?: string;
}
async function ThreadsTab({ currentUserId,
  accountId,
  accountType }: props) {

    // fetch profile 


    let result = await getUserPost(accountId)
   

    if(!result) redirect('/')
  return (
    <section className='mt-9 flex flex-col gap-10'>
      { result.threads.map((thread : any) =>(
         <ThreadCard
         key={thread._id}
         id={thread._id}
         crrentUserId={currentUserId}
         parentId={thread.parentId}
         content={thread.text}
         author={accountType === 'User' ? {name : result.name , image : result.image , id : result.id} : { name : thread.author.name , image : thread.author.image , id : thread.author.id}}
         community={thread.community}
         comments={thread.children}
         createdAt={thread.createdAt}
         isComment={true}
     />
      ))}
    </section>
  )
}

export default ThreadsTab