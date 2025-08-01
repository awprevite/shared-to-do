'use client'

import Header from '@/app/components/Header'
import List from '@/app/components/List'
import Loading from '@/app/components/Loading'
import Notification from '@/app/components/Notification'

import type { User, Invite, Group } from '@/utils/database/types'

import { signOutUser } from '@/utils/supabase/actions/auth'
import { fetchUser } from '@/utils/supabase/actions/users'
import { fetchGroups, createGroup } from '@/utils/supabase/actions/groups'
import { fetchInvites, updateInvite } from '@/utils/supabase/actions/invites'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Check, X } from 'lucide-react' 

export default function UserPage () {

  const router = useRouter();

  const [acting, setActing] = useState(false) // True while completing an async function, prevent double clicks
  
  const [loading, setLoading] = useState(true) // True while loading inital data
  const [done, setDone] = useState(false) // True once done loading

  const [message, setMessage] = useState<string | null>(null) // Message used in the notification
  const triggerNotification = (message: string) => setMessage(message)

  const [user, setUser] = useState<User | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [invites, setInvites] = useState<Invite[]>([])
  const [groupName, setGroupName] = useState<string>('')

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
        triggerNotification('Unable to fetch groups and invites')
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
      triggerNotification('error')
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
      await createGroup(groupName, user!.user_id)
    } catch (error) {
      triggerNotification('Unable to create group')
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
      triggerNotification('Unable to update invite')
    } finally {
      setActing(false)
    }
  }

  const handleGroupSelect = (groupId: string) => {
    router.push(`/group/${groupId}`)
  }

  if(loading) return <Loading done={done}/>

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
                    <p className='truncate'>{invite.from_user!.email}</p>
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

        </div>
      </div>
    </>
  )
}