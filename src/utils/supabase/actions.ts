'use server';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { User, Group, Member, Task, Invite } from '@/utils/database/types'

/**
 * @param email the email of the user to create
 * @param password the password of the user to create
 * 
 * @return {Promise<void>} redirects to the user dashboard on success
 * @throws {Error} if authentication sign up fails or the query fails
 */
export async function signUpUser ( email: string, password: string ): Promise<void> {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })

  if (authError) throw new Error(authError.message)

  if (authData.user) {
    const { data: dbData, error: dbError } = await supabase
      .from('users')
      .insert([
        {
          user_id: authData.user.id,
          email: authData.user.email
        }
      ])
      .select()

    if (dbError) throw new Error(dbError.message)
  }
}

/**
 * @param email the email of the user to log in
 * @param password the password of the user to log in
 * 
 * @return {Promise<void>} redirects to the user dashboard on success
 * @throws {Error} if authentication sign in fails or the query fails
 */
export async function signInUser ( email: string, password: string ): Promise<void> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  console.log('Sign in data:', data)

  if (error) throw new Error(error.message)

  redirect('/user')
}

/**
 * @returns {Promise<void>} redirects to the home page on success
 * @throws {Error} if sign out fails
 */
export async function logoutUser (): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) throw new Error(error.message)

  redirect('/')
}

export async function deactivateUser ( user_id: string ) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .update({ active: false })
    .eq('user_id', user_id);

    if (error) throw new Error(error.message)

    return data
}

export async function activateUser ( user_id: string ) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .update({ active: true })
    .eq('user_id', user_id);

    if (error) throw new Error(error.message)

    return data
}

export async function checkManager ( group_id: string, user_id: string ) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('groups')
    .select('creator_id')
    .eq('group_id', group_id)
    .eq('creator_id', user_id)

  if (error) throw new Error(error.message)

  return data && data.length > 0
}

export async function fetchTasks ( group_id: string ) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('group_id', group_id)

  if (error) throw new Error(error.message)

  return data
}

export async function fetchMembers ( group_id: string ) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('group_id', group_id)

  if (error) throw new Error(error.message)

  return data
}

/**
 * @param to_user_id the user ID to fetch invites for
 * 
 * @returns {Promise<Invite[]>} an array of pending invites for the user
 * @throws {Error} if the query fails
 */
export async function fetchInvites (to_user_id: string): Promise<Invite[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('invites')
    .select('*')
    .eq('to_user_id', to_user_id)
    .eq('status', 'pending')

  if (error) throw new Error(error.message)

  console.log('Fetched invites:', data)

  return data
}

/**
 * @param user_id the user ID to fetch groups for
 * 
 * @returns {Promise<any[]>} an array of groups the user is a member of
 * @throws {Error} if the query fails
 */
export async function fetchGroups(user_id: string): Promise<any[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('members')
    .select('group_id, groups(*)')
    .eq('user_id', user_id)

  if (error) throw new Error(error.message)

  console.log('Fetched groups:', data)

  return data
}

/**
 * @returns {Promise<User | null>} the authenticated user or null if not authenticated
 * @throws {Error} if authentication fails
 */
export async function fetchUser(): Promise<User | null> {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()

  if (authError) throw new Error(authError.message)

  if (authData.user) {
    const { data: dbData, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', authData.user.id)

    if (dbError) throw new Error(dbError.message)

    return dbData[0];
  }
  return null;
}

// /* ------ Groups ------ */

export async function createGroup ( name: string , creator_id: string ) {
  const supabase = await createClient()

  const { data: groupData, error: groupError } = await supabase
    .from('groups')
    .insert([
      {
        name: name,
        creator_id: creator_id
      }
    ])
    .select()

  if(groupError) throw new Error(groupError.message);

  if (groupData && groupData.length > 0 && groupData[0].group_id){

    const group_id = groupData[0].group_id

    const { data: memberData, error: memberError } = await supabase
    .from('members')
    .insert([
      {
        user_id: creator_id,
        group_id: group_id
      }
    ])
    .select()

    if ( memberError ) console.log(memberError.message)

    redirect(`/group/${group_id}`)
  } else {
    console.log('No group found to place creator')
  }
}

/**
 * @returns {Promise<number>} the total number of users in the 'users' table
 * @throws {Error} if the query fails
 */
export async function totalUsers(): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  if (error) throw new Error(error.message)

  return count ?? 0
}

/**
 * @returns {Promise<number>} the total number of groups in the 'groups' table
 * @throws {Error} if the query fails
 */
export async function totalGroups(): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('groups')
    .select('*', { count: 'exact', head: true })

  if (error) throw new Error(error.message);

  return count ?? 0
}

// export async function deleteGroup ( group_id: UUID ) {

//   const { data, error } = await supabase
//     .from('groups')
//     .delete()
//     .eq('group_id', group_id)

//   if (error) throw new Error(error.message);

//   return data
// }

// /* ------ Invites ------ */

export async function createInvite (group_id: string, from_user_id: string, to_user_email: string ) {

  const supabase = await createClient()

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', to_user_email)

    if (userError) throw new Error(userError.message);

    const to_user_id = userData && userData.length > 0 ? userData[0].user_id : null;
    if (!to_user_id) throw new Error('User not found with that email');

    const { data: existing, error: checkError } = await supabase
      .from('invites')
      .select()
      .eq('group_id', group_id)
      .eq('to_user_id', to_user_id)
      .eq('status', 'pending')

  if (checkError) throw new Error(checkError.message)
  if (existing.length > 0) throw new Error('Invite already pending')

  const { data, error } = await supabase
    .from('invites')
    .insert([
      {
        group_id: group_id,
        from_user_id: from_user_id,
        to_user_id: to_user_id
      }
    ])
    .select()

    if ( error ) throw new Error(error.message);

    return data
}

export async function fetchGroupInvites ( group_id: string ) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('invites')
    .select('*')
    .eq('group_id', group_id)

    if ( error ) throw new Error(error.message);

    return data
}

export async function updateInvite (invite_id: string, newStatus: 'accepted' | 'rejected' | 'revoked') {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()

  if( authError || !authData?.user ) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('invites')
    .update({ status: newStatus })
    .eq('invite_id', invite_id)
    .select('*')

  console.log(data)

  if ( error ) throw new Error(error.message);

  return data
}

export async function acceptInvite (group_id: string, to_user_id: string ) {
  const supabase = await createClient()

  const { data: inviteData, error: inviteError } = await supabase
    .from('invites')
    .update({ status: 'accepted' })
    .eq('group_id', group_id)
    .eq('to_user_id', to_user_id)
    .select()

    if ( inviteError ) throw new Error(inviteError.message);

    if (inviteData && inviteData.length > 0 && inviteData[0].group_id) {

    const accepted_group_id = inviteData[0].group_id

    const { data: memberData, error: memberError } = await supabase
    .from('members')
    .insert([
      {
        user_id: to_user_id,
        group_id: accepted_group_id
      }
    ])
    .select()

    if ( memberError ) throw new Error(memberError.message)

    return { inviteData, memberData }
  } else {
    throw new Error('No invite found to accept')
  }
}

// export async function rejectInvite (group_id: UUID, to_user_id: UUID ) {

//   const { data, error } = await supabase
//     .from('invites')
//     .update({ status: 'rejected' })
//     .eq('group_id', group_id)
//     .eq('to_user_id', to_user_id)
//     .select()

//     if ( error ) throw new Error(error.message);

//     return data
// }

// export async function leaveGroup (group_id: UUID, user_id: UUID){
//   const { data, error } = await supabase
//     .from('members')
//     .delete()
//     .eq('group_id', group_id)
//     .eq('user_id', user_id)

//   if(error) throw new Error(error.message)

//   return data
// }

// /* ------ Tasks ------ */

export async function createTask ( group_id: string, description: string, creator_id: string ) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        group_id: group_id,
        description: description,
        creator_id: creator_id
      }
    ])
    .select()

    if ( error ) throw new Error(error.message);

    return data
}

// export async function deleteTask ( task_id: UUID ){
//   const { data, error } = await supabase
//     .from('tasks')
//     .delete()
//     .eq('task_id', task_id)

//   if(error) throw new Error(error.message)

//   return data
// }

// export async function claimTask ( task_id: UUID, claimer_id: UUID ){
//   const { data, error } = await supabase
//     .from('tasks')
//     .update({ claimer_id: claimer_id })
//     .eq('task_id', task_id)
//     .select()

//   if(error) throw new Error(error.message)

//   return data
// }

// export async function unclaimTask ( task_id: UUID ){
//   const { data, error } = await supabase
//     .from('tasks')
//     .update({ claimer_id: null })
//     .eq('task_id', task_id)
//     .select()

//   if(error) throw new Error(error.message)

//   return data
// }

// export async function completeTask ( task_id: UUID, claimer_id: UUID ){
//   const { data, error } = await supabase
//     .from('tasks')
//     .update({ completed: true })
//     .eq('task_id', task_id)
//     .select()

//   if(error) throw new Error(error.message)

//   return data
// }

// export async function uncompleteTask ( task_id: UUID ){
//   const { data, error } = await supabase
//     .from('tasks')
//     .update({ completed: false })
//     .eq('task_id', task_id)
//     .select()

//   if(error) throw new Error(error.message)

//   return data
// }