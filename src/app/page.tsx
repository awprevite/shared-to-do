'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { totalUsers, totalGroups } from '@/utils/supabase/actions'
import { Square, SquareCheckBig } from 'lucide-react'

export default function Home() {

  const router = useRouter();

  const [users, setUsers] = useState<number>(0);
  const [groups, setGroups] = useState<number>(0);

  useEffect(()  => {
    const fetchData = async () => {
      try {
        const [users, groups] = await Promise.all([totalUsers(), totalGroups()])
        setUsers(users);
        setGroups(groups);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [])

  return (
    <div className='flex flex-col justify-center items-center gap-6 translate-y-50'>
      <p className='text-7xl p-2'>Shared To Do</p>
      <div className='flex flex-col items-start gap-2'>
        <div className='flex gap-2 justify-start items-center'>
          <SquareCheckBig />
          <p className='text-lg p-2'>Multi-user to do and task lists</p>
        </div>
        <div className='flex gap-2 justify-start items-center'>
          <SquareCheckBig />
          <p className='text-lg p-2'>{`Powering ${users} ${users == 1 ? 'user' : 'users'} and ${groups} ${groups == 1 ? 'group' : 'groups'}`}</p>
        </div>
        <div className='flex gap-2 justify-start items-center'>
          <Square />
          <p className='text-lg p-2'>Access your dashboard to get started</p>
        </div>
      </div>
      <button className='bg-[var(--light-accent)] p-2 w-3xs rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => router.push('/login')}>Sign In / Sign Up</button>
    </div>
  )
}
