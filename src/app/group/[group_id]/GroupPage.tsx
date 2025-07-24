'use client';
import Header from '../../components/Header'
import List from '../../components/List'
import { useRouter } from 'next/navigation'
import { Task, Member, Invite } from '@/utils/database/types'
import { useState, useEffect, useRef } from 'react'
import { fetchUser, checkManager, fetchTasks, fetchMembers, createTask, createInvite, fetchGroupInvites } from '@/utils/supabase/actions'

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

  const handleTaskDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDescription(e.target.value);
  }
  const handleCreateTask = () => {
    createTask(groupId, taskDescription, userId!)
  }
  
  return(
    <>
      <Header email={email} groupName={groupId} buttonName='Back' onClick={handleExitGroup}/>
      <List 
        title='tasks'
        items={tasks}
        renderItems={( task ) => (
          <div className='flex w-full justify-between'>
            <p>{task.description}</p>
          </div>
        )}
        emptyMessage='No tasks to display'
      />
      <List 
        title='members'
        items={members}
        renderItems={(member) => (
          <div className='flex w-full justify-between'>
            <p>{member.user_id}</p>
          </div>
        )}
        emptyMessage='No members to display'
      />
      <List 
        title='invites'
        items={groupInvites}
        renderItems={(invite) => (
          <div className='flex w-full justify-between'>
            <p>{invite.status}</p>
            <p>{invite.to_user_id}</p>
          </div>
        )}
        emptyMessage='No invites to display'
      />
      { manager.current ? (
        <>
          <p>you ARE the creator</p> 
          <input className='border border-solid border-[var(--fg-color)] p-2 w-sm rounded-lg focus:outline-none focus:ring-0' value={ taskDescription } onChange={ handleTaskDescriptionChange } placeholder='Task description' />
          <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={handleCreateTask}>Create Task</button>
          <input className='border border-solid border-[var(--fg-color)] p-2 w-sm rounded-lg focus:outline-none focus:ring-0' value={ inviteEmail } onChange={ handleInviteEmailChange } placeholder='Email' />
          <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={handleCreateInvite}>Create Invite</button>
        </>
      ) : ( 
        <>
          <p>you are NOT the creator</p> 
        </>
      )}
     
    </>
  )
}