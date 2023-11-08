import ThreadCard from '@/components/cards/ThreadCard';
import Comments from '@/components/forms/Comments';
import { fetchThreadById } from '@/lib/actions/thread.action';
import { fetchUser } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

async function page({ params }: { params: { id: string } }) {
    if(!params.id) return null;
    const user = await currentUser();

    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo.onboarded) redirect('/onboarding');

    const thread = await fetchThreadById(params?.id);
    return (
        <section className='relative'>
            <div>
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    crrentUserId={user?.id || ""}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    comments={thread.children}
                    createdAt={thread.createdAt}
                />
            </div>
            <div className="mt-5">
                <Comments 
                threadId ={thread.id}
                currentUserImg={user.imageUrl}
                currentUserId = {JSON.stringify(userInfo._id)}
                />
            </div>
            <div className="mt-10">
                {
                    thread.children.map((child :any) => (
                        <ThreadCard
                            key={child._id}
                            id={child._id}
                            crrentUserId={user?.id || ""}
                            parentId={child.parentId}
                            content={child.text}
                            author={child.author}
                            community={child.community}
                            comments={child.children}
                            createdAt={child.createdAt}
                            isComment={true}
                        />
                    ))
                }
            </div>
        </section>
    )
}

export default page;