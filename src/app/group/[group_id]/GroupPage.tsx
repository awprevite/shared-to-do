'use client';
import Header from '../../components/Header'
import List from '../../components/List'
import Loading from '../../components/Loading'
import { useRouter } from 'next/navigation'
import type { User, Task, Member, Invite, Group } from '@/utils/database/types'
import { useState, useEffect } from 'react'
import { fetchUser } from '@/utils/supabase/actions/users'
import { checkAccess, fetchMembers, updateMemberRole, deleteMember } from '@/utils/supabase/actions/members'
import { fetchGroupInvites, createInvite, updateInvite } from '@/utils/supabase/actions/invites'
import { fetchTasks, createTask, deleteTask, updateTask } from '@/utils/supabase/actions/tasks'
import { fetchGroup } from '@/utils/supabase/actions/groups'
import { mapSupabaseError } from '@/utils/supabase/errors/errors'
import { deleteGroup } from '@/utils/supabase/actions/groups'
import { Square, SquareCheckBig, Trash } from 'lucide-react'
import Notification from '../../components/Notification'

type GroupProps = {
  groupId: string;
}

export default function Group({ groupId }: GroupProps) {

  const router = useRouter();

  const [group, setGroup] = useState<Group | null>(null)
  const [acting, setActing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)
  const [access, setAccess] = useState<'member' | 'admin' | 'creator'>();
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [groupInvites, setGroupInvites] = useState<Invite[]>([]);
  const [message, setMessage] = useState<string | null>(null)
  const triggerNotification = (message: string) => setMessage(message)

  useEffect(() => {

    const fetchData = async () => {
      try {

        const user = await fetchUser();

        if(!user) {
          router.push('/login');
          return
        }
        setUser(user)

        const [group, access, tasks, members, invites] = await Promise.all([
          fetchGroup(groupId),
          checkAccess(groupId, user.user_id),
          fetchTasks(groupId),
          fetchMembers(groupId),
          fetchGroupInvites(groupId)
        ]);

        setGroup(group)
        setAccess(access)
        setTasks(tasks)
        setMembers(members)
        setGroupInvites(invites)

      } catch (error) {
        if (error instanceof Error) triggerNotification(mapSupabaseError(error))
      }

      setDone(true)
      setTimeout(() => {
        setLoading(false)
      }, 300)

    }
    fetchData()
  }, [])

  const handleUpdateTask = async (task_id: string, new_status: 'pending' | 'claimed' | 'completed', claimer_id: string) => {
    
    if(acting) return
    setActing(true)
    
    try {
      setTasks(await updateTask(task_id, new_status, claimer_id))
      triggerNotification(`Task status set to ${new_status}`)
    } catch (error) {
      if (error instanceof Error) triggerNotification(mapSupabaseError(error))
    } finally {
      setActing(false)
    }
  }

  const handleCreateInvite = async () => {

    if(acting) return
    setActing(true)

    if(!inviteEmail.includes('@')){
    triggerNotification('Enter a valid email before inviting')
    setActing(false)
    return
    }

    try {
      setInviteEmail('')
      setGroupInvites(await createInvite(groupId, user!.user_id, inviteEmail));
      triggerNotification('Invite sent')
    } catch (error) {
      if (error instanceof Error) triggerNotification(mapSupabaseError(error))
    } finally {
      setActing(false)
    }
  }

  const handleUpdateInvite = async (invite_id: string) => {

    if(acting) return
    setActing(true)

    try {
      setGroupInvites(await updateInvite(invite_id, 'revoked'))
      triggerNotification('invite revoked')
    } catch (error) {
      if (error instanceof Error) triggerNotification(mapSupabaseError(error))
    } finally {
      setActing(false)
    }
  }

  const handleCreateTask = async () => {

    if(acting) return
    setActing(true)

    if(taskDescription.length < 1){
      triggerNotification('Enter a task name before creating a task')
      setActing(false)
      return
    }

    try {
      setTaskDescription('')
      setTasks(await createTask(groupId, taskDescription, user!.user_id))
      triggerNotification('Task created')
    } catch (error) {
      if (error instanceof Error) triggerNotification(mapSupabaseError(error))
    } finally {
      setActing(false)
    }
  }

  const handleDeleteMember = async (user_id: string) => {

    if(acting) return
    setActing(true)

    try {
      setMembers(await deleteMember(groupId, user_id))
      if(user_id === user!.user_id) router.push('user')
      triggerNotification('Member removed')
    } catch (error) {
      if (error instanceof Error) triggerNotification(mapSupabaseError(error))
    } finally {
      setActing(false)
    }
  }

  const handleUpdateMemberRole = async (user_id: string, new_role: 'admin' | 'member') => {
    
    if(acting) return
    setActing(true)
    
    try {
      setMembers(await updateMemberRole(groupId, user_id, new_role))
      triggerNotification(`Member set to ${new_role}`)
    } catch (error) {
      if (error instanceof Error) triggerNotification(mapSupabaseError(error))
    } finally {
      setActing(false)
    }
  }

  const handleDeleteTask = async (task_id: string) => {
    if(acting) return
    setActing(true)

    try {
      setTasks(await deleteTask(task_id))
      triggerNotification('Task deleted')
    } catch (error) {
      if (error instanceof Error) triggerNotification(mapSupabaseError(error))
    } finally {
      setActing(false)
    }
  }

  if(loading) return <Loading done={done}/>

  const adminView = (
    <>
      <Header email={user!.email} groupName={group!.name} buttonName='Back' onClick={() => router.push('/user')}/>
      <Notification message={message} onClear={() => setMessage(null)} />

        <div className='container mx-auto px-4 flex flex-col items-center'>

          <div className='grid grid-cols-1 gap-6 w-full max-w-8xl min-w-l items-start'>

            {/* Tasks list */}
            <List
              title='Tasks'
              items={tasks}
              renderItems={( task ) => (
                <div className='grid grid-cols-[auto_2fr_1fr_2fr_auto] w-full items-center gap-6'>

                  {/* Completetion check box */}
                  <div className='flex justify-start'>
                    { task.status === 'pending' ? (
                      <button onClick={() => triggerNotification('Task must be claimed before it can be completed')}><Square /></button>
                    ) : task.status === 'claimed' ? (
                      <button onClick={() => {task.claimer_id === user!.user_id ? handleUpdateTask(task.task_id, 'completed', user!.user_id) : triggerNotification('Cannot complete a task claimed by someone else')}}><Square /></button>
                    ) : (
                      <button onClick={() => {task.claimer_id === user!.user_id ? handleUpdateTask(task.task_id, 'claimed', user!.user_id) : triggerNotification('Cannot uncomplete a task completed by someone else')}}><SquareCheckBig /></button>
                    )}
                  </div>
                
                  <div className='flex justify-start w-full overflow-hidden'>
                    <p className={`truncate ${task.status === 'completed' ? 'line-through' : ''}`}>{task.description}</p>
                  </div>

                  {/* Status indicator */}
                  <div className='flex items-center gap-6 w-full overflow-hidden'>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.status === 'pending'
                          ? 'bg-[var(--neutral)]'
                          : task.status === 'claimed'
                          ? 'bg-[var(--fg-color)]'
                          : 'bg-[var(--success)]'
                      }`}
                    />
                    <p className='truncate'>{task.status}</p>
                  </div>

                  {/* Claimer or claim or unclaim option */}
                  <div className='flex justify-start w-full overflow-hidden pl-1'>
                    { (task.status === 'claimed' && task.claimer_id === user!.user_id) ? (
                      <button className='text-[var(--dark-accent)] bg-[var(--fg-color)] w-20 rounded-full' onClick={() => handleUpdateTask(task.task_id, 'pending', user!.user_id)}>UnClaim</button>
                    ) : task.status === 'claimed' ? (
                      <p className='truncate'>{task.users!.email}</p>
                    ) : task.status === 'completed' ? (
                      <p className='truncate'>{task.users!.email}</p>
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

            {/* Members list */}
            <List 
              title='Members'
              items={members}
              renderItems={(member) => {

                const isMemberSelf = member.user_id === user?.user_id
                const canModify = access === 'creator' && !isMemberSelf

                return (

                  <div className='grid grid-cols-[2fr_1fr_1fr_1fr_auto] w-full items-center gap-6'>

                    <div className='flex justify-start w-full overflow-hidden'>
                      <p className='truncate'>{member.users!.email}</p>
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

            {/* Invites list */}
            <List 
              title='Invites'
              items={groupInvites}
              renderItems={(invite) => {

                const canModify = access === 'creator'

                return (
                <div className='grid grid-cols-[_2fr_1fr_1fr] w-full items-center gap-6'>

                  <div className='flex justify-start w-full overflow-hidden'>
                    <p className='truncate'>{invite.users!.email}</p>
                  </div>

                  <div className='flex justify-start w-full overflow-hidden'>
                    <p className='truncate'>{invite.status}</p>
                  </div>

                  <div className='flex justify-end'>
                    {invite.status === 'pending' ? (
                      canModify ? (
                        <button onClick={() => handleUpdateInvite(invite.invite_id)}><Trash /></button>
                      ) : (
                        <div className='w-6 h-6' />
                      )
                    ) : (
                      <p>No Action</p>
                    )}
                  </div>
                </div>
                )
              }}
            />

            <div className='flex justify-center items-center w-full'>
              <hr className='w-full max-w-8xl border-t border my-6' />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-8xl items-start'>

              <div className='flex flex-col items-center bg-[var(--dark-accent)] rounded-lg gap-4 p-6 w-full'>
                <input className='border border-solid border-[var(--fg-color)] p-2 w-full rounded-lg focus:outline-none focus:ring-0' value={ taskDescription } onChange={ e => setTaskDescription(e.target.value) } placeholder='Task description' />
                <button className='bg-[var(--light-accent)] p-2 w-full rounded-lg' onClick={handleCreateTask}>Create Task</button>
              </div>

              <div className='flex flex-col items-center bg-[var(--dark-accent)] rounded-lg gap-4 p-6 w-full'>
                <input className='border border-solid border-[var(--fg-color)] p-2 w-full rounded-lg focus:outline-none focus:ring-0' value={ inviteEmail } onChange={ e => setInviteEmail(e.target.value) } placeholder='Email' />
                <button className='bg-[var(--light-accent)] p-2 w-full rounded-lg' onClick={handleCreateInvite}>Create Invite</button>
              </div>

              <div className='flex flex-col items-center bg-[var(--dark-accent)] rounded-lg gap-4 p-6 w-full'>
                <button className='text-[var(--dark-accent)] bg-[var(--fg-color)] p-2 w-full rounded-lg' onClick={() => deleteGroup(groupId)}>Delete Group</button>
              </div>

              {access != 'creator' && (
                <div className='flex flex-col items-center bg-[var(--dark-accent)] rounded-lg gap-4 p-6 w-full'>
                  <button className='text-[var(--dark-accent)] bg-[var(--fg-color)] p-2 w-full rounded-lg' onClick={() => handleDeleteMember(user!.user_id)}>Leave Group</button>
                </div>
              )}

            </div>
          </div> 
        </div>
    </>
  )

  const memberView = <p>Member, update this according to admin view when finished and justv delete some stuff</p>
  
  return (
    <>
      {(access === 'creator') || (access === 'admin') ? adminView : memberView}
    </>
  )
}