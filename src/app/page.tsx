'use client' 
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { totalUsers, totalGroups } from '@/utils/supabase/actions/stats'
import { signUpUser, signInUser } from '@/utils/supabase/actions/auth'
import { Square, SquareCheckBig } from 'lucide-react'

export default function Home() {
 
  const router = useRouter();

  const [users, setUsers] = useState<number>(0);
  const [groups, setGroups] = useState<number>(0);

  // useEffect(()  => {
  //   const fetchData = async () => {
  //     try {
  //       const [users, groups] = await Promise.all([totalUsers(), totalGroups()])
  //       setUsers(users);
  //       setGroups(groups);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   }
  //   fetchData();
  // }, [])

  return (
    <>
      {/* Entire screen */}
      <div className='flex flex-col justify-center items-center bg-check h-screen w-full gap-6'>

        <p className='text-7xl pb-15'>Shared To Do</p>

        {/* Check list */}
        <div className='flex flex-col items-start gap-10'>

          {/* Check rows */}
          <div className='flex justify-start items-center gap-4'>
            <SquareCheckBig />
            <p className='text-2xl p-2'>Multi-user to do and task lists</p>
          </div>

          <div className='flex justify-start items-center gap-4'>
            <SquareCheckBig />
            <p className='text-2xl p-2'>{`Powering ${users} ${users == 1 ? 'user' : 'users'} and ${groups} ${groups == 1 ? 'group' : 'groups'}`}</p>
          </div>

          <div className='flex justify-start items-center gap-4'>
            <Square />
            <p className='text-2xl p-2'>Access your dashboard to get started</p>
          </div>
        </div>

        <button className=' text-2xl bg-[var(--light-accent)] p-2 mt-6 mb-2 w-sm rounded-lg' onClick={ () => {router.push('/login')} }>Go to sign in</button>

      </div>
    </>
  )
}
