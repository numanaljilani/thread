import Image from 'next/image';
import React from 'react'


interface props {
    acountId: string;
    authUserId: string;
    name: string;
    username: string;
    imgUrl: string;
    bio: string;
}
function ProfileHeader({ acountId,
    authUserId,
    name,
    username,
    imgUrl,
    bio }: props) {
    return (
        <div className='flex flex-col w-full justify-start'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                    <div className="relative object-cover h-20 w-20">
                    <Image src={imgUrl} alt='profle' fill className='shadow-2xl rounded-full object-cover' />
                    </div>
                    <div className='flex-1'>
                        <h2 className='text-left text-heading3-bold text-light-1'>{name}</h2>
                        <p className=' text-base-medium text-gray-1'>@{username}</p>
                    </div>
                </div>
            </div>
            <p className='mt-6 max-w-lg text-base-regular text-light-2'>{bio}</p>
            <div className='h-0.5 mt-12 bg-dark-2 w-full'/>
        </div>
    )
}

export default ProfileHeader