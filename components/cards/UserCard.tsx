'use client'
import Image from 'next/image';
import React from 'react'
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
interface Props {
    id: string;
    name: string;
    username: string;
    imgUrl: string;
    personType: string;
}
function UserCard({ id,
    name,
    username,
    imgUrl,
    personType, }: Props) {

        const router = useRouter()
    return (
        <section className='user-card'>
            <div className='user-card_avatar'>
                <Image
                    src={imgUrl}
                    alt='profile pic'
                    width={48}
                    height={48}
                    className='rounded-full'
                />
                <div className='flex-1 text-ellipsis '>
                    <h4 className='text-base-semibold text-light-1'>{name}</h4>
                    <p className='text-gray-1 text-small-medium'>@{username}</p>
                </div>
            </div>
            <Button className='user-card_btn' onClick={()=> router.push(`/profile/${id}`)}>
                View
            </Button>
        </section>
    )
}

export default UserCard