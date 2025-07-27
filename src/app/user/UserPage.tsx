'use client';
import Header from '../components/Header'
import List from '../components/List'
import Notification from '../components/Notification'
import Loading from '../components/Loading'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { signOutUser } from '@/utils/supabase/actions/auth'
import { fetchUser, updateUser } from '@/utils/supabase/actions/users'
import { fetchGroups, createGroup } from '@/utils/supabase/actions/groups'
import { fetchInvites, updateInvite } from '@/utils/supabase/actions/invites'
import { mapSupabaseError } from '@/utils/supabase/errors/errors'
import { User, Invite, Group } from '../../utils/database/types'
import { Check, X } from 'lucide-react' 

export default function UserPage() {

  const router = useRouter();

  const [acting, setActing] = useState(false);
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)
  const [user, setUser] = useState<User | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null)
  const triggerNotification = (message: string) => setMessage(message)

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
        if (error instanceof Error) triggerNotification(mapSupabaseError(error))
      }

      setDone(true)
      setTimeout(() => {
        setLoading(false)
      }, 300)
    }

    fetchData();
  }, [])

  const handleSignOut = async () => {

    if(acting) return
    setActing(true)

    try {
      signOutUser();
    } catch (error) {
      if (error instanceof Error) triggerNotification(mapSupabaseError(error))
    } finally { 
      setActing(false)
    }
  }

  const handleCreateGroup = async () => {

    if(acting) return
    setActing(true)

    if(groupName.length < 1){
      triggerNotification('Enter a group name before creating a group')
      setActing(false)
      return
    }

    try {
      createGroup(groupName, user!.user_id)
      triggerNotification('Group Created')
    } catch (error) {
      if (error instanceof Error) triggerNotification(mapSupabaseError(error))
    } finally {
      setActing(false)
    }
  }

  const handleUpdateInvite = async (invite_id: string, new_status: 'accepted' | 'rejected') => {
    
    if(acting) return
    setActing(true)

    try{
      const [invites, groups] = await Promise.all([updateInvite(invite_id, new_status), fetchGroups(user!.user_id)])
      setInvites(invites)
      setGroups(groups)
      triggerNotification(`Invite ${new_status}`)
    } catch (error) {
      if (error instanceof Error) triggerNotification(mapSupabaseError(error))
    } finally {
      setActing(false)
    }
  }

  const handleGroupSelect = (groupId: string) => {
    router.push(`/group/${groupId}`)
  }

  const handleUpdateUser = async (user_id: string, new_status: boolean) => {

    if(acting) return
    setActing(true)

    try {
      setUser(await updateUser(user_id, new_status))
      triggerNotification(`Account ${new_status ? 'activated' : 'deactivated'}`)
    } catch (error) {
      if (error instanceof Error) triggerNotification(mapSupabaseError(error))
    } finally {
      setActing(false)
    }
  }

  if(loading) return <Loading done={done}/>

  if(!user!.active) return (
    <div className='flex flex-col justify-center items-center p-2 gap-2 h-screen'>
      <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => handleUpdateUser(user!.user_id, true)}>Activate Account</button>
    </div>
  )

  return (
    <>
      <Header email={user!.email} buttonName='Sign out' onClick={handleSignOut}/>
      <Notification message={message} onClear={() => setMessage(null)} />
      
      <div className='container mx-auto px-4 flex flex-col items-center'>
      
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl items-start'>

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
              <div className='grid grid-cols-[1fr_1fr_auto] w-full items-start gap-4'>

                  <div className='flex justify-start w-full overflow-hidden'>
                    <p className='truncate'>{invite.groups!.name}</p>
                  </div>

                  <div className='flex justify-start w-full overflow-hidden'>
                    <p className='truncate'>{invite.users!.email}</p>
                  </div>
                <div className='flex gap-6'>
                  <button onClick={() => handleUpdateInvite(invite.invite_id, 'accepted')}><Check className='text-[var(--light-accent)]'/></button>
                  <button onClick={() => handleUpdateInvite(invite.invite_id, 'rejected')}><X /></button>
                </div>
              </div>
            )}
          />
        </div>

        {/* Divider */}
        <div className='flex justify-center items-center w-full'>
          <hr className='w-full max-w-4xl border-t border my-6' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl items-start'>

          <div className='flex flex-col items-center bg-[var(--dark-accent)] rounded-lg gap-4 p-6 w-full'>
            <input className='border border-[var(--fg-color)] p-2 rounded-lg w-full focus:outline-none focus:ring-0' value={ groupName } onChange={ e => setGroupName(e.target.value) } placeholder='Group Name' />
            <button className='bg-[var(--light-accent)] p-2 rounded-lg w-full' onClick={handleCreateGroup}>Create Group</button>
          </div>

          <div className='flex flex-col items-center bg-[var(--dark-accent)] rounded-lg gap-4 p-6 w-full'>
            <button className='text-[var(--dark-accent)] bg-[var(--fg-color)] p-2 rounded-lg w-full' onClick={() => handleUpdateUser(user!.user_id, false)}>Deactivate Account</button>
          </div>
        </div>
      </div>
    </>
  )
}