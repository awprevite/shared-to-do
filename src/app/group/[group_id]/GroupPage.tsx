'use client';
import Header from '../../components/Header'
import List from '../../components/List'
import { useRouter } from 'next/navigation'
import { User, Task, Member, Invite } from '@/utils/database/types'
import { useState, useEffect } from 'react'
import { fetchUser } from '@/utils/supabase/actions/users'
import { checkAdmin, fetchMembers, updateMemberRole, deleteMember } from '@/utils/supabase/actions/members'
import { fetchGroupInvites, createInvite, updateInvite } from '@/utils/supabase/actions/invites'
import { fetchTasks, createTask, deleteTask, updateTask } from '@/utils/supabase/actions/tasks'
import { deleteGroup } from '@/utils/supabase/actions/groups'
import { Trash } from 'lucide-react'

type GroupProps = {
  groupId: string;
}

export default function Group({ groupId }: GroupProps) {

  const router = useRouter();

  const [adminAccess, setAdminAccess] = useState<boolean>(false);
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [groupInvites, setGroupInvites] = useState<Invite[]>([]);

  useEffect(() => {

    const fetchData = async () => {
      try {

        const user = await fetchUser();

        if(!user) {
          router.push('/login');
          return
        }
        setUser(user)

        const [isAdmin, tasks, members, invites] = await Promise.all([
          checkAdmin(groupId, user.user_id),
          fetchTasks(groupId),
          fetchMembers(groupId),
          fetchGroupInvites(groupId)
        ]);

        console.log('Fetched data:', { isAdmin, tasks, members, invites });

        setAdminAccess(isAdmin);
        setTasks(tasks);
        setMembers(members);
        setGroupInvites(invites);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData()
  }, [])

  const handleUpdateTask = async (task_id: string, new_status: 'pending' | 'claimed' | 'completed', claimer_id: string) => {
    setTasks(await updateTask(task_id, new_status, claimer_id))
  }

  const handleCreateInvite = async () => {
    setInviteEmail('')
    setGroupInvites(await createInvite(groupId, user!.user_id, inviteEmail));
  }

  const handleUpdateInvite = async (invite_id: string) => {
    setGroupInvites(await updateInvite(invite_id, 'revoked'))
  }

  const handleCreateTask = async () => {
    setTaskDescription('')
    setTasks(await createTask(groupId, taskDescription, user!.user_id))
  }

  const handleDeleteMember = async (user_id: string) => {
    setMembers(await deleteMember(groupId, user_id))
  }

  const handleUpdateMemberRole = async (user_id: string, new_role: 'admin' | 'member') => {
    setMembers(await updateMemberRole(groupId, user_id, new_role))
  }

  const handleDeleteTask = async (task_id: string) => {
    setTasks(await deleteTask(task_id))
  }

  if(!user) return <p>No user</p>
  const adminView = (
    <div className='flex flex-col items-center'>
      <Header email={user!.email} groupName={groupId} buttonName='Back' onClick={() => router.push('/user')}/>
      <div className='flex flex-col jkustify-center items-center p-2 gap-2 max-w-7xl min-w-lg'>
        <List
          title='Tasks'
          items={tasks}
          renderItems={( task ) => (
            <div className='grid grid-cols-7 w-full gap-4 items-center'>
              <p className='text-left truncate col-span-2'>{task.description}</p>
              <p>{task.status}</p>
              { task.claimer_id ? (
                <p>{task.claimer_id}</p>
              ) : (
                <button className='bg-[var(--light-accent)] w-16 rounded-sm transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => handleUpdateTask(task.task_id, 'claimed', user!.user_id)}>Claim</button>
              )}
              {task.status === 'claimed' ? (
                <button className='bg-[var(--danger)] w-16 rounded-sm transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => handleUpdateTask(task.task_id, 'pending', user!.user_id)}>UnClaim</button>
              ) : (
                <p>empty</p>
              )}
              {task.status === 'pending' && <p>empty</p>}
              {task.status === 'claimed' && <button className='bg-[var(--light-accent)] w-16 rounded-sm transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => handleUpdateTask(task.task_id, 'completed', user!.user_id)}>Complete</button>}
              {task.status === 'completed' && <button className='bg-[var(--danger)] w-16 rounded-sm transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => handleUpdateTask(task.task_id, 'claimed', user!.user_id)}>UnComplete</button>}
              <button className='bg-[var(--danger)] w-16 rounded-sm transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => handleDeleteTask(task.task_id)}><Trash /></button>
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
              { member.role !== 'creator' && member.user_id !== user!.user_id && <button className='bg-[var(--danger)] w-16 rounded-sm transition-transform duration-300 hover:scale-105 cursor-pointer' onClick = {() => handleDeleteMember(member.user_id)}><Trash /></button>}
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
              {invite.status === 'pending' ? (
                <button className='bg-[var(--danger)] w-16 rounded-sm transition-transform duration-300 hover:scale-105 cursor-pointer' onClick = {() => handleUpdateInvite(invite.invite_id)}>Revoke</button>
              ) : (
                <p>No Action</p>
              )}
            </div>
          )}
          emptyMessage='No invites to display'
        />

        <div className='flex flex-col justify-center items-center p-2 gap-2'>
          <p>Admin operations</p>
          <input className='border border-solid border-[var(--fg-color)] p-2 w-sm rounded-lg focus:outline-none focus:ring-0' value={ taskDescription } onChange={ e => setTaskDescription(e.target.value) } placeholder='Task description' />
          <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={handleCreateTask}>Create Task</button>
          <input className='border border-solid border-[var(--fg-color)] p-2 w-sm rounded-lg focus:outline-none focus:ring-0' value={ inviteEmail } onChange={ e => setInviteEmail(e.target.value) } placeholder='Email' />
          <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={handleCreateInvite}>Create Invite</button>
          <button className='bg-[var(--danger)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => deleteGroup(groupId)}>Delete Group</button>
        </div>
      </div>
    </div>
  )

  const memberView = <p>Member, update this according to admin view when finished and justv delete some stuff</p>
  
  return (
    <>
      {adminAccess ? adminView : memberView}
    </>
  )
}