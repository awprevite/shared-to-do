'use client';
import Header from '../components/Header'
import List from '../components/List'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { logoutUser, fetchUser, fetchInvites, fetchGroups, createGroup, updateInvite } from '../../utils/supabase/actions'
import { Invite, Group } from '../../utils/database/types'

export default function UserPage() {

  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [invites, setInvites] = useState<Invite[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState<string>('');

  useEffect(() => {

    const fetchData = async () => {
      try{

        const user = await fetchUser();
        if (!user) {
          router.push('/login');
          return
        }

        if (user.email && user.user_id) {
          setEmail(user.email)
          setUserId(user.user_id)
        }
      
      const [invites, groups] = await Promise.all([fetchInvites(user.user_id), fetchGroups(user.user_id)])
        setInvites(invites)
        setGroups(groups)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [])

  const handleLogout = async () => {
    logoutUser();
  }

  const handleCreateGroup = async () => {
    createGroup(groupName, userId!)
  }

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  }

  const handleUpdateInvite = (invite_id: string, new_status: 'accepted' | 'rejected') => {
    updateInvite(invite_id, new_status)
  }

  const handleRejectInvite = () => {
    alert('Rejecting Invite')
  }

  const handleGroupSelect = (groupId: string) => {
    router.push(`/group/${groupId}`)
  }

  return (
    <>
      <Header email={email} buttonName='logout' onClick={handleLogout}/>
      <div className='flex flex-col justify-center items-center p-2 gap-2'>
        <List 
          title='invites'
          items={invites} 
          renderItems={(invite) => (
            <div className='flex w-full justify-between'>
              <p>{invite.status}</p>
              <div className='flex gap-6'>
                <button onClick={() => handleUpdateInvite(invite.invite_id, 'accepted')}>{'\u2713'}</button>
                <button onClick={() => handleUpdateInvite(invite.invite_id, 'rejected')}>{'\u2715'}</button>
              </div>
            </div>
          )}
          emptyMessage='No invites to display' 
        />
        <List title='groups'
          items={groups}
          renderItems={(group) => (
            <button onClick={() => handleGroupSelect(group.group_id)}>{group.name}</button>
          )}
          emptyMessage='No groups to display'
        />

        <input className='border border-solid border-[var(--fg-color)] p-2 w-sm rounded-lg focus:outline-none focus:ring-0' value={ groupName } onChange={ handleGroupNameChange } placeholder='Group Name' />
        <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={handleCreateGroup}>Create Group</button>
      </div>
    </>
  )
}