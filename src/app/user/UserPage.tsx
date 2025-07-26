'use client';
import Header from '../components/Header'
import List from '../components/List'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { signOutUser } from '@/utils/supabase/actions/auth'
import { fetchUser, updateUser } from '@/utils/supabase/actions/users'
import { fetchGroups, createGroup } from '@/utils/supabase/actions/groups'
import { fetchInvites, updateInvite } from '@/utils/supabase/actions/invites'
import { User, Invite, Group } from '../../utils/database/types'
import { Check, X } from 'lucide-react' 

export default function UserPage() {

  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState<string>('');

  useEffect(() => {

    const fetchData = async () => {
      try {

        const user = await fetchUser();
        if (!user) {
          router.push('/login');
          return
        }
        setUser(user);
      
        const [invites, groups] = await Promise.all([fetchInvites(user.user_id), fetchGroups(user.user_id)])
        setInvites(invites)
        setGroups(groups)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [])

  const handleSignOut = async () => {
    signOutUser();
  }

  const handleCreateGroup = async () => {
    createGroup(groupName, user!.user_id)
  }

  const handleUpdateInvite = async (invite_id: string, new_status: 'accepted' | 'rejected') => {
    try{
      const [invites, groups] = await Promise.all([updateInvite(invite_id, new_status), fetchGroups(user!.user_id)])
      setInvites(invites)
      setGroups(groups)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleGroupSelect = (groupId: string) => {
    router.push(`/group/${groupId}`)
  }

  const handleUpdateUser = async (user_id: string, new_status: boolean) => {
    setUser(await updateUser(user_id, new_status))
  }

  if(!user) return <p>No user</p>

  if(!user.active) return (
    <div className='flex flex-col justify-center items-center p-2 gap-2'>
      <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => handleUpdateUser(user.user_id, true)}>Activate Account</button>
    </div>
  )

  return (
    <>
      <Header email={user!.email} buttonName='Sign out' onClick={handleSignOut}/>
      
      <div className='flex flex-col justify-center items-center'>
      
        <div className='flex justify-between items-center p-2 w-full'>

          {/* Groups list */}
          <List title='Groups'
            items={groups}
            renderItems={(group) => (
              <button onClick={() => handleGroupSelect(group.group_id)}>{group.name}</button>
            )}
          />

          {/* Invites list */}
          <List 
            title='Invites'
            items={invites} 
            renderItems={(invite) => (
              <div className='flex w-full justify-between'>
                <p>{invite.group_id}</p>
                <div className='flex gap-6'>
                  <button onClick={() => handleUpdateInvite(invite.invite_id, 'accepted')}><Check /></button>
                  <button onClick={() => handleUpdateInvite(invite.invite_id, 'rejected')}><X /></button>
                </div>
              </div>
            )}
          />
        </div>

        <div className='flex items-center w-full'>
          <hr className='flex border-t border w-full m-8' />
        </div>

        <div className='flex justify-between items-center p-2 w-full'>
          <div className='flex flex-col justify-center items-center bg-[var(--dark-accent)] rounded-lg w-full mx-20 py-6'>
            <input className='border border-solid border-[var(--fg-color)] p-2 w-sm rounded-lg focus:outline-none focus:ring-0' value={ groupName } onChange={ e => setGroupName(e.target.value) } placeholder='Group Name' />
            <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg' onClick={handleCreateGroup}>Create Group</button>
          </div>
          <div className='flex flex-col justify-center items-center bg-[var(--dark-accent)] rounded-lg w-full mx-20 py-6'>
            <button className='text-[var(--dark-accent)] bg-[var(--fg-color)] p-2 w-sm rounded-lg' onClick={() => handleUpdateUser(user.user_id, false)}>Deactivate Account</button>
          </div>
        </div>
      </div>
    </>
  )
}