import Image from 'next/image';
import Link from 'next/link';
import React from 'react'


interface props {
    id: string;
    crrentUserId: string | null | undefined;
    parentId: string | null;
    content: string;
    author: {
        name: string;
        image: string;
        id: string;
    },
    community: {
        name: string;
        image: string;
        id: string;
    } | null;
    createdAt: string;
    comments: {
        author: {
            image: string;
        }
    }[]
    isComment?: boolean


}
function ThreadCard({
    id,
    crrentUserId,
    parentId,
    content,
    author,
    community,
    comments,
    isComment,
    createdAt }: props) {
    return (
        <article className={`flex flex-col w-full rounded-xl ${isComment ?"px-0 xs:px-7":"bg-dark-2 p-7"}`}>
            <div className='flex justify-between items-start'>
                <div className='flex flex-1 w-full flex-row gap-4'>
                    <div className='flex flex-col items-center'>
                        <Link href={`profile/${author?.id}`} className='relative h-11 w-11'>
                            <Image src={author.image} alt='profile' fill className="cursor-pointer rounded-full" />
                        </Link>
                        <div className='thread-card_bar' />
                    </div>
                    <div className="flex flex-col w-full">
                        <Link href={`profile/${author?.id}`} className='w-fit'>
                            <h4 className="cursor-pointer text-base-semibold text-light-1">{author?.name}</h4>
                        </Link>
                        <p className='text-small-regular mt-2 text-light-2'>{content}</p>
                        <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
                            <div className="flex gap-3.5">
                                <Image src={'/heart-gray.svg'} alt="heart" width={24} height={24} className='cursor-pointer object-contain' />
                                <Link href={`/thread/${id}`} className=''>
                                    <Image src={'/reply.svg'} alt="heart" width={24} height={24} className='cursor-pointer object-contain' />
                                </Link>
                                <Image src={'/repost.svg'} alt="heart" width={24} height={24} className='cursor-pointer object-contain' />
                                <Image src={'/share.svg'} alt="heart" width={24} height={24} className='cursor-pointer object-contain' />
                            </div>
                            {
                                isComment && comments.length > 0 && (
                                    <Link href={`/thread/${id}`} className=''>
                                        <p className='mt-1 text-subtle-medium text-gray-1'>{comments.length} replies</p>
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* <h2 className="text-smll-regular text-light-2">{content}</h2> */}
        </article>
    )
}

export default ThreadCard