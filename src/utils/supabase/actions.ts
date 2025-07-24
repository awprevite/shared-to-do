'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

/* ------ Users ------ */

export async function createUser ( email: string, password: string ) {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })

  if (authError){
    console.error('Error creating user:', authError.message)
    redirect('/error')
  }

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

    if (dbError) {
      console.error('Error inserting user into database:', dbError.message)
      redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/user')
  }
}

export async function loginUser ( email: string, password: string ) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) redirect('/error')

  revalidatePath('/', 'layout')
  redirect('/user')
}

export async function logoutUser () {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) redirect('/error')

  revalidatePath('/', 'layout')
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

export async function fetchInvites ( user_id: string ) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('invites')
    .select('*')
    .eq('to_user_id', user_id)
    .eq('status', 'pending')

  if (error) throw new Error(error.message)

  return data
}

export async function fetchGroups ( user_id: string ) {
  const supabase = await createClient()

  const { data: memberData, error: memberError } = await supabase
  .from('members')
  .select('*')
  .eq('user_id', user_id)

  if (memberError) throw new Error(memberError.message)

  if (memberData && memberData.length > 0) {
    const groupIds = memberData.map(member => member.group_id)
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .select('*')
      .in('group_id', groupIds)

    if (groupError) throw new Error(groupError.message)

      return groupData
  } else {
    console.log('No groups found for user')
    return []
  }
}

export async function fetchUser () {
  const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser();

    if( !data || error ) {
      console.log('Error fetching user')
      return
    }
  
  return data.user;
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

export async function totalUsers() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .select('*', { count: 'exact' })

  if (error) throw new Error(error.message);

  return data
}

export async function totalGroups() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('groups')
    .select('*', { count: 'exact' })

  if (error) throw new Error(error.message);

  return data
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

// export async function deleteInvite (group_id: UUID, from_user_id: UUID, to_user_id: UUID ) {

//   const { data, error } = await supabase
//     .from('invites')
//     .update({ status: 'revoked' })
//     .eq('group_id', group_id)
//     .eq('from_user_id', from_user_id)
//     .eq('to_user_id', to_user_id)
//     .select()

//     if ( error ) throw new Error(error.message);

//     return data
// }

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