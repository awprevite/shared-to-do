'use client'
import { useRouter } from 'next/navigation'
import { totalUsers, totalGroups } from '@/utils/supabase/actions'

import { useState, useEffect } from 'react'

export default function Home() {

  const router = useRouter();

  const [users, setUsers] = useState<number>(0);
  const [groups, setGroups] = useState<number>(0);

  useEffect(()  => {
    const fetchData = async () => {
      const users = await totalUsers()
      const groups = await totalGroups()
      setUsers(users.length);
      setGroups(groups.length);
    }
    fetchData();
  }, [])

  return (
    <div className='flex flex-col justify-center items-center h-screen gap-6'>
      <p className='text-7xl p-2'>Shared To Do</p>
      <p className='text-lg p-2'>{'\u2611 Multi-user to do and task lists'}</p>
      <p className='text-lg p-2'>{`\u2611 Powering ${users} ${users == 1 ? 'user' : 'users'} and ${groups} ${groups == 1 ? 'group' : 'groups'}`}</p>
      <button className='bg-[var(--light-accent)] p-2 w-3xs rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => router.push('/login')}>Login / Create Account</button>
    </div>
  )
}
