'use client';
import Header from '../../components/Header'
import List from '../../components/List'
import { useRouter } from 'next/navigation'
import { Task, Member, Invite } from '@/utils/database/types'
import { useState, useEffect, useRef } from 'react'
import { fetchUser, checkManager, fetchTasks, fetchMembers, createTask, createInvite, updateInvite, fetchGroupInvites } from '@/utils/supabase/actions'

type GroupProps = {
  groupId: string;
}

export default function Group({ groupId }: GroupProps) {

  const router = useRouter();

  const [taskDescription, setTaskDescription] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [groupInvites, setGroupInvites] = useState<Invite[]>([]);
  const manager = useRef<boolean>(false);

  useEffect(() => {

    const setManager = async () => {
      const user = await fetchUser();

      if( !user ) return

      const userId = user.id
      setUserId(userId);

      setEmail(user.email || '');

      const isManager = await checkManager(groupId, userId)
      manager.current = isManager
      console.log('Is Manager:', manager.current);
    }

    const fetchGroupData = async () => {
      const tasks = await fetchTasks(groupId);
      setTasks(tasks);

      const members = await fetchMembers(groupId);
      setMembers(members);

      const invites = await fetchGroupInvites(groupId);
      setGroupInvites(invites);
    }

    setManager();
    fetchGroupData();

  }, [])

  const handleExitGroup = () => {
    router.push('/user')
  }

  const handleClaimTask = () => {
    
  }

  const handleCompleteTask = () => {

  }

  const handleInviteEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(e.target.value);
  }
  const handleCreateInvite = () => {
    createInvite(groupId, userId!, inviteEmail);
  }
  const handleUpdateInvite = (invite_id: string) => {

    console.log(updateInvite(invite_id, 'revoked'))
  }

  const handleTaskDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDescription(e.target.value);
  }
  const handleCreateTask = () => {
    createTask(groupId, taskDescription, userId!)
  }
  const handleRemoveMember = (user_id: string) => {

  }

  const handleUpdateMemberRole = (user_id: string, new_role: 'admin' | 'member') => {
  }

  const adminView = (
    <div className='flex flex-col items-center'>
      <Header email={email} groupName={groupId} buttonName='Back' onClick={handleExitGroup}/>
      <div className='flex flex-col jkustify-center items-center p-2 gap-2 max-w-6xl min-w-lg'>
        <List
          title='Tasks'
          items={tasks}
          renderItems={( task ) => (
            <div className='grid grid-cols-5 w-full gap-4 items-center'>
              <p className='text-left truncate col-span-3'>{task.description}</p>
              <p>{task.status}</p>
              { task.claimer_id ? (
                <p>{task.claimer_id}</p>
              ) : (
                <button className='bg-[var(--light-accent)] w-16 rounded-sm transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={handleClaimTask}>Claim</button>
              )}
            </div>
          )}
          emptyMessage='No tasks to display'
        />
        <List 
          title='Members'
          items={members}
          renderItems={(member) => (
            <div className='grid grid-cols-5 w-full gap-4 items-center'>
              <p className='text-left truncate col-span-2'>{member.user_id}</p>
              <p>{member.role}</p>
              { member.role === 'member' && (
                <button className='bg-[var(--light-accent)] w-16 rounded-sm transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => handleUpdateMemberRole(member.user_id, 'admin')}>Promote</button>
              )}
              { member.role === 'admin' && (
                <button className='bg-[var(--danger)] w-16 rounded-sm transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => handleUpdateMemberRole(member.user_id, 'member')}>Demote</button>
              )}
              { member.role === 'creator' && (
                <p>Full Access</p>
              )}
              <button className='bg-[var(--danger)] w-16 rounded-sm transition-transform duration-300 hover:scale-105 cursor-pointer' onClick = {() => handleRemoveMember(member.user_id)}>Remove</button>
            </div>
          )}
          emptyMessage='No members to display'
        />
        <List 
          title='Invites'
          items={groupInvites}
          renderItems={(invite) => (
            <div className='grid grid-cols-5 w-full gap-4 items-center'>
              <p className='text-left truncate col-span-3'>{invite.to_user_id}</p>
              <p>{invite.status}</p>
              <button className='bg-[var(--danger)] w-16 rounded-sm transition-transform duration-300 hover:scale-105 cursor-pointer' onClick = {() => handleUpdateInvite(invite.invite_id)}>Revoke</button>
            </div>
          )}
          emptyMessage='No invites to display'
        />

        <div className='flex flex-col justify-center items-center p-2 gap-2'>
          <p>Admin operations</p>
          <input className='border border-solid border-[var(--fg-color)] p-2 w-sm rounded-lg focus:outline-none focus:ring-0' value={ taskDescription } onChange={ handleTaskDescriptionChange } placeholder='Task description' />
          <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={handleCreateTask}>Create Task</button>
          <input className='border border-solid border-[var(--fg-color)] p-2 w-sm rounded-lg focus:outline-none focus:ring-0' value={ inviteEmail } onChange={ handleInviteEmailChange } placeholder='Email' />
          <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={handleCreateInvite}>Create Invite</button>
        </div>
      </div>
    </div>
  )

  const memberView = (
    <div className='flex flex-col items-center'>
      <Header email={email} groupName={groupId} buttonName='Back' onClick={handleExitGroup}/>
      <div className='flex flex-col jkustify-center items-center p-2 gap-2 max-w-6xl min-w-lg'>
        <List
          title='Tasks'
          items={tasks}
          renderItems={( task ) => (
            <div className='grid grid-cols-5 w-full gap-4 items-center'>
              <p className='text-left truncate col-span-3'>{task.description}</p>
              <p>{task.status}</p>
              { task.claimer_id ? (
                <p>{task.claimer_id}</p>
              ) : (
                <button className='bg-[var(--light-accent)] w-16 rounded-sm transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={handleClaimTask}>Claim</button>
              )}
            </div>
          )}
          emptyMessage='No tasks to display'
        />
        <List 
          title='Members'
          items={members}
          renderItems={(member) => (
            <div className='flex justify-between w-full gap-4 items-center'>
              <p>{member.user_id}</p>
              <p>{member.role}</p>
            </div>
          )}
          emptyMessage='No members to display'
        />
        <List 
          title='Invites'
          items={groupInvites}
          renderItems={(invite) => (
            <div className='flex justify-between w-full gap-4 items-center'>
              <p>{invite.to_user_id}</p>
              <p>{invite.status}</p>
            </div>
          )}
          emptyMessage='No invites to display'
        />
      </div>
    </div>
  )
  
  return(
    memberView
  )
}