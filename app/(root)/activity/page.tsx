import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { fetchUser, fetchUsers, getActivity } from '@/lib/actions/user.action';
import Image from 'next/image';
import UserCard from '@/components/cards/UserCard';
import Link from 'next/link';


const page = async () => {

  const user: any = await currentUser();
  if (!user) redirect('/sign-in');

  const userInfo = await fetchUser(user.id);
  console.log(userInfo.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getActivity(userInfo._id);

  return (
    <section>
      <h2 className='head-text mb-10'>Activity</h2>
      <section className='flex flex-col mt-10 gap-5'>
        {
          activity.length > 0 ? (<>
            {
              activity.map((activity: any) => (
                <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                  
                  <article className='activity-card'>
                    <Image src={activity.author.image}
                      alt='profile pic'
                      width={20}
                      height={20}
                      className='rounded-full object-cover' />
                    <p className='text-small-regular text-light-1'>                   
                      <span className='mr-1 text-primary-500'>{activity.author.name ? activity.author.name : "Anonymous"}</span>{' '}
                      replied to your thread
                    </p>
                  </article>
                </Link>
              ))
            }
          </>) : (<p className='text-base-regular text-gray-1'>No Activity found</p>)
        }
      </section>
    </section>
  )
}

export default page