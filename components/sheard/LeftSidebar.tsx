"use client"
import Link from 'next/link';
import { sidebarLinks } from './../../constant/index';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {   SignOutButton, SignedIn, useAuth } from '@clerk/nextjs';

function LeftSidebar() {
  const router = useRouter();
  const pathName = usePathname();
  const {userId} = useAuth();
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 gap-6 px-6 flex-col">
        {
          sidebarLinks.map((link) => {
            const isActive = (pathName.includes(link.route) && link.route.length > 1) || pathName === link.route
            if(link.route === '/profile') link.route = `/profile/${userId}`
            return (
              <Link href={link.route} key={link.label} className={`leftsidebar_link ${isActive && "bg-primary-500"}`}>
                <Image src={link.imgURL} alt={link.label} height={24} width={24} />
                <p className='text-light-1 max-lg:hidden'>{link.label}</p>
              </Link>
            )
          })
        }
      </div>
      <div className="flex w-full flex-1 gap-6 px-6 flex-col">
        <SignedIn>
          <SignOutButton signOutCallback = {()=> router.push("/sign-in")}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image src="/logout.svg" alt="logout" width={24} height={24} />
              <p className="text-light-2 max-lg:hidden">logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  )
}

export default LeftSidebar