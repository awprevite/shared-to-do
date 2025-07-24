'use client';
import Header from '../components/Header'
import List from '../components/List'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { logoutUser, fetchInvites, fetchGroups, fetchUser, createGroup, acceptInvite } from '../../utils/supabase/actions'
import { Invite, Group } from '../../utils/database/types'
import { group } from 'console';

export default function UserPage() {

  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState<string>('');

  useEffect(() => {

    const fetchUserInfo = async () => {

      const user = await fetchUser();

      if( !user ) return

      const userId = user.id
      setUserId(userId);

      setEmail(user.email || '');

      const invites = await fetchInvites(userId);
      setInvites(invites);

      const groups = await fetchGroups(userId);
      setGroups(groups);
    }

    fetchUserInfo();
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

  const handleAcceptInvite = (group_id: string, to_user_id: string) => {
    acceptInvite(group_id, to_user_id)
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
                <button onClick={() => handleAcceptInvite(invite.group_id, invite.to_user_id)}>{'\u2713'}</button>
                <button onClick={handleRejectInvite}>{'\u2715'}</button>
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