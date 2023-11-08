import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { fetchUser, fetchUsers } from '@/lib/actions/user.action';
import Image from 'next/image';
import UserCard from '@/components/cards/UserCard';


const page = async () => {

  const user: any = await currentUser();
  if (!user) redirect('/sign-in');

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchUsers({
    userId: user.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 20
  })
  return (
    <section>
      <h2 className='head-text mb-10'>Search</h2>
      <div className="mt-14 flex flex-col gap-9">
        {
          result.users.lenght === 0 ? (<p className="no-result">No users found</p>) : (
            <>
              {result.users.map((person: any) => (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType='User'
                />
              ))}
            </>)
        }
      </div>
    </section>
  )
}

export default page