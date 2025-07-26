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

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [status, setStatus] = useState<boolean>(false);
  const [state, setState] = useState<'Sign in' | 'Sign up'>('Sign in')

  const handleAuthenticate = async () => {
    try {
      if(state === 'Sign in') {
        await signInUser(email, password)
      } else if (state === 'Sign up') {
        await signUpUser(email, password)
        setStatus(true)
      }
    } catch (error) {
      console.error('Sign Authentication error: ', error)
    }
  }

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
      <div className='flex flex-col justify-center items-center gap-6 bg-check h-screen w-full'>

        <p className='text-7xl pb-15'>Shared To Do</p>

        {/* Check list */}
        <div className='flex flex-col items-start gap-10'>

          {/* Check rows */}
          <div className='flex gap-4 justify-start items-center'>
            <SquareCheckBig />
            <p className='text-2xl p-2'>Multi-user to do and task lists</p>
          </div>

          <div className='flex gap-4 justify-start items-center'>
            <SquareCheckBig />
            <p className='text-2xl p-2'>{`Powering ${users} ${users == 1 ? 'user' : 'users'} and ${groups} ${groups == 1 ? 'group' : 'groups'}`}</p>
          </div>

          <div className='flex gap-4 justify-start items-center'>
            <Square />
            <p className='text-2xl p-2'>Access your dashboard to get started</p>
          </div>
        </div>

        <button className=' text-2xl bg-[var(--light-accent)] p-2 mt-6 mb-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={ () => {router.push('/login')} }>Go to sign in</button>

      </div>
    </>
  )
}
