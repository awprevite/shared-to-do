import { UUID } from 'crypto';
import supabase from './supabaseConnection'

/* ------ Types (match schema) ------ */

type User = {
  user_id: string;
  email: string;
  active: string;
  created_at: string;
}

type Group = {
  group_id: string;
  name: string;
  creator_id: string;
  created_at: string;
}

/* ------ Users ------ */

export async function loginUser ( email: string, password: string ) {

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

  if (authError) throw new Error(authError.message);

  return authData;
}

export async function logoutUser () {
  const { error } = await supabase.auth.signOut()

  if(error) {
    throw new Error(error.message)
  }
}

export async function createUser ( email: string, password: string ) {

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

    return { authData, dbData }
  }
}

export async function deactivateUser ( user_id: UUID ) {

  const { data, error } = await supabase
    .from('users')
    .update({ active: false })
    .eq('user_id', user_id);

    if (error) throw new Error(error.message)

    return data
}

export async function activateUser ( user_id: UUID ) {

  const { data, error } = await supabase
    .from('users')
    .update({ active: true })
    .eq('user_id', user_id);

    if (error) throw new Error(error.message)

    return data
}

/* ------ Groups ------ */

export async function createGroup ( name: string , creator_id: UUID ) {

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

    if ( memberError ) throw new Error(memberError.message)

  return { groupData, memberData }
  } else {
    throw new Error('No group found to place creator')
  }
}

export async function deleteGroup ( group_id: UUID ) {

  const { data, error } = await supabase
    .from('groups')
    .delete()
    .eq('group_id', group_id)

  if (error) throw new Error(error.message);

  return data
}

/* ------ Invites ------ */

export async function createInvite (group_id: UUID, from_user_id: UUID, to_user_id: UUID ) {

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

export async function deleteInvite (group_id: UUID, from_user_id: UUID, to_user_id: UUID ) {

  const { data, error } = await supabase
    .from('invites')
    .update({ status: 'revoked' })
    .eq('group_id', group_id)
    .eq('from_user_id', from_user_id)
    .eq('to_user_id', to_user_id)
    .select()

    if ( error ) throw new Error(error.message);

    return data
}

export async function acceptInvite (group_id: UUID, to_user_id: UUID ) {

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

export async function rejectInvite (group_id: UUID, to_user_id: UUID ) {

  const { data, error } = await supabase
    .from('invites')
    .update({ status: 'rejected' })
    .eq('group_id', group_id)
    .eq('to_user_id', to_user_id)
    .select()

    if ( error ) throw new Error(error.message);

    return data
}

export async function leaveGroup (group_id: UUID, user_id: UUID){
  const { data, error } = await supabase
    .from('members')
    .delete()
    .eq('group_id', group_id)
    .eq('user_id', user_id)

  if(error) throw new Error(error.message)

  return data
}

/* ------ Tasks ------ */

export async function createTask ( group_id: UUID, description: string, creator_id: UUID ) {
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

export async function deleteTask ( task_id: UUID ){
  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('task_id', task_id)

  if(error) throw new Error(error.message)

  return data
}

export async function claimTask ( task_id: UUID, claimer_id: UUID ){
  const { data, error } = await supabase
    .from('tasks')
    .update({ claimer_id: claimer_id })
    .eq('task_id', task_id)
    .select()

  if(error) throw new Error(error.message)

  return data
}

export async function unclaimTask ( task_id: UUID ){
  const { data, error } = await supabase
    .from('tasks')
    .update({ claimer_id: null })
    .eq('task_id', task_id)
    .select()

  if(error) throw new Error(error.message)

  return data
}

export async function completeTask ( task_id: UUID, claimer_id: UUID ){
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed: true })
    .eq('task_id', task_id)
    .select()

  if(error) throw new Error(error.message)

  return data
}

export async function uncompleteTask ( task_id: UUID ){
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed: false })
    .eq('task_id', task_id)
    .select()

  if(error) throw new Error(error.message)

  return data
}