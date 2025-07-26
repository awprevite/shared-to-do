'use client';
import Header from '../../components/Header'
import List from '../../components/List'
import { useRouter } from 'next/navigation'
import { User, Task, Member, Invite } from '@/utils/database/types'
import { useState, useEffect } from 'react'
import { fetchUser } from '@/utils/supabase/actions/users'
import { checkAccess, fetchMembers, updateMemberRole, deleteMember } from '@/utils/supabase/actions/members'
import { fetchGroupInvites, createInvite, updateInvite } from '@/utils/supabase/actions/invites'
import { fetchTasks, createTask, deleteTask, updateTask } from '@/utils/supabase/actions/tasks'
import { deleteGroup } from '@/utils/supabase/actions/groups'
import { Square, SquareCheckBig, Trash } from 'lucide-react'
import Notification from '../../components/Notification'

type GroupProps = {
  groupId: string;
}

export default function Group({ groupId }: GroupProps) {

  const router = useRouter();

  const [access, setAccess] = useState<'member' | 'admin' | 'creator'>();
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

        const [access, tasks, members, invites] = await Promise.all([
          checkAccess(groupId, user.user_id),
          fetchTasks(groupId),
          fetchMembers(groupId),
          fetchGroupInvites(groupId)
        ]);

        console.log('Fetched data:', { access, tasks, members, invites });

        setAccess(access);
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

  const [message, setMessage] = useState<string | null>(null)
  const triggerNotification = (message: string) => setMessage(message)

  if(!user) return <p>No user</p>

  const adminView = (
    <div className='flex flex-col items-center'>
      <Header email={user!.email} groupName={groupId} buttonName='Back' onClick={() => router.push('/user')}/>

      <button onClick={() => triggerNotification('Notification')}>trigger notification</button>
      <button onClick={() => triggerNotification('Other')}>trigger other</button>
      <Notification message={message} onClear={() => setMessage(null)} />

      <div className='flex flex-col justify-center items-center p-2 gap-2 max-w-7xl min-w-lg'>

        <List
          title='Tasks'
          items={tasks}
          renderItems={( task ) => (
            <div className='grid grid-cols-[auto_2fr_1fr_2fr_auto] w-full items-center gap-6'>

              {/* Completetion check box */}
              <div className='flex justify-start'>
                { task.status === 'pending' ? (
                  <button onClick={() => alert('Task must be claimed before it can be completed')}><Square /></button>
                ) : task.status === 'claimed' ? (
                  <button onClick={() => handleUpdateTask(task.task_id, 'completed', user!.user_id)}><Square /></button>
                ) : (
                  <button onClick={() => handleUpdateTask(task.task_id, 'claimed', user!.user_id)}><SquareCheckBig /></button>
                )}
              </div>
            
              <div className='flex justify-start w-full overflow-hidden'>
                <p className='truncate'>{task.description}</p>
              </div>

              {/* Status indicator */}
              <div className='flex items-center gap-6 w-full overflow-hidden'>
                <div
                  className={`w-2 h-2 rounded-full ${
                    task.status === 'pending'
                      ? 'bg-[var(--fg-color)]'
                      : task.status === 'claimed'
                      ? 'bg-[var(--neutral)]'
                      : 'bg-[var(--success)]'
                  }`}
                />
                <p className='truncate'>{task.status}</p>
              </div>

              {/* Claimer or claim or unclaim option */}
              <div className='flex justify-start w-full overflow-hidden pl-1'>
                { (task.status === 'claimed' && task.claimer_id === user.user_id) ? (
                  <button className='text-[var(--dark-accent)] bg-[var(--fg-color)] w-20 rounded-full' onClick={() => handleUpdateTask(task.task_id, 'pending', user!.user_id)}>UnClaim</button>
                ) : task.status === 'claimed' ? (
                  <p className='truncate'>{task.claimer_id}</p>
                ) : task.status === 'completed' ? (
                  <p className='truncate'>{task.claimer_id}</p>
                ) : (
                  <button className='bg-[var(--light-accent)] w-20 rounded-full' onClick={() => handleUpdateTask(task.task_id, 'claimed', user!.user_id)}>Claim</button>
                )}
              </div>

              <div className='flex justify-end'>
                <button onClick={() => handleDeleteTask(task.task_id)}><Trash /></button>
              </div>
            </div>
          )}
        />

        <List 
          title='Members'
          items={members}
          renderItems={(member) => {

            const isMemberSelf = member.user_id === user?.user_id
            const canModify = access === 'creator' && !isMemberSelf

            return (

              <div className='grid grid-cols-[2fr_1fr_1fr_1fr_auto] w-full items-center gap-6'>

                <div className='flex justify-start w-full overflow-hidden'>
                  <p className='truncate'>{member.user_id}</p>
                </div>

                <div className='flex items-center gap-6 w-full overflow-hidden'>
                  <p className='text-lg font-bold'>{member.role[0].toUpperCase()}</p>
                  <p className='truncate'>{member.role}</p>
                </div>

                <div>
                  { canModify && member.role === 'member' && (
                    <button className='bg-[var(--light-accent)] w-20 rounded-full' onClick={() => handleUpdateMemberRole(member.user_id, 'admin')}>Promote</button>
                  )}
                  { canModify && member.role === 'admin' && (
                    <button className='text-[var(--dark-accent)] bg-[var(--fg-color)] w-20 rounded-full' onClick={() => handleUpdateMemberRole(member.user_id, 'member')}>Demote</button>
                  )}
                  { member.role === 'creator' && (
                    <p>Full Access</p>
                  )}
                </div>

                <div className='flex justify-start w-full overflow-hidden'>
                  <p className='truncate'>{new Date(member.joined_at).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}</p>
                </div>

                <div className='flex justify-end'>
                  {canModify ? (
                    <button onClick = {() => handleDeleteMember(member.user_id)}><Trash /></button>
                  ) : (
                    <div className='w-6 h-6' />
                  )}
                </div>
              </div>
            )
          }}
        />


        <List 
          title='Invites'
          items={groupInvites}
          renderItems={(invite) => {

            const canModify = access === 'creator'

            return (
            <div className='grid grid-cols-[_2fr_1fr_1fr] w-full items-center gap-6'>

              <div className='flex justify-start w-full overflow-hidden'>
                <p className='truncate'>{invite.to_user_id}</p>
              </div>

              <div className='flex justify-start w-full overflow-hidden'>
                <p className='truncate'>{invite.status}</p>
              </div>

              <div className='flex justify-end'>
                {invite.status === 'pending' ? (
                  <button onClick = {() => handleUpdateInvite(invite.invite_id)}><Trash /></button>
                ) : (
                  <p>No Action</p>
                )}
              </div>
            </div>
            )
          }}
        />

        <div className='flex items-center w-full'>
          <hr className='flex border-t border w-full m-8' />
        </div>

        <div className='grid grid-cols-2 justify-center items-center p-2 gap-2'>
          <div className='flex flex-col justify-center items-center bg-[var(--dark-accent)] rounded-lg w-full mx-20 py-6'>
            
            <input className='border border-solid border-[var(--fg-color)] p-2 w-sm rounded-lg focus:outline-none focus:ring-0' value={ taskDescription } onChange={ e => setTaskDescription(e.target.value) } placeholder='Task description' />
            <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg' onClick={handleCreateTask}>Create Task</button>
          
          </div>
          <div className='flex flex-col justify-center items-center bg-[var(--dark-accent)] rounded-lg w-full mx-20 py-6'>
            
            <input className='border border-solid border-[var(--fg-color)] p-2 w-sm rounded-lg focus:outline-none focus:ring-0' value={ inviteEmail } onChange={ e => setInviteEmail(e.target.value) } placeholder='Email' />
            <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg' onClick={handleCreateInvite}>Create Invite</button>
          </div>

          <div className='flex flex-col justify-center items-center bg-[var(--dark-accent)] rounded-lg w-full mx-20 py-6'>
            <button className='text-[var(--dark-accent)] bg-[var(--fg-color)] p-2 w-sm rounded-lg' onClick={() => deleteGroup(groupId)}>Delete Group</button>
          </div>

        </div>
      </div>  
    </div>
  )

  const memberView = <p>Member, update this according to admin view when finished and justv delete some stuff</p>
  
  return (
    <>
      {(access === 'creator') || (access === 'admin') ? adminView : memberView}
    </>
  )
}