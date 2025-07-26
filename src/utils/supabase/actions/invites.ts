'use server';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { User, Group, Member, Task, Invite } from '@/utils/database/types'

/**
 * Fetches the pending invites to a user
 * 
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

  return data
}

/**
 * Fetches all invites for a group
 * 
 * @param group_id the group ID to fetch invites for
 * 
 * @returns {Promise<Invite>} an array of all invites for the group
 * @throws {Error} if the query fails
 */
export async function fetchGroupInvites( group_id: string ): Promise<Invite[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('invites')
    .select('*')
    .eq('group_id', group_id)

    if (error) throw new Error(error.message)

    return data
}

/**
 * Inserts an invite into the 'invites' table if there is not already a pending invite from that group to that user
 * 
 * @param group_id
 * @param from_user_id 
 * @param to_user_email
 * 
 * @returns {Promise<Invite[]>}
 * @throws {Error} if the query fails
 */
export async function createInvite( group_id: string, from_user_id: string, to_user_email: string ): Promise<Invite[]> {
  const supabase = await createClient()

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', to_user_email)
      .single()

    if (userError) throw new Error(userError.message)

    if (!userData) throw new Error('User not found with that email')

    const to_user_id = userData.user_id

    const { data: existing, error: checkError } = await supabase
      .from('invites')
      .select('*')
      .eq('group_id', group_id)
      .eq('to_user_id', to_user_id)
      .eq('status', 'pending')
      .maybeSingle()

  if (checkError) throw new Error(checkError.message)
  if (existing) throw new Error('Invite already pending')

  const { data: inviteData, error: inviteError } = await supabase
    .from('invites')
    .insert([
      {
        group_id: group_id,
        from_user_id: from_user_id,
        to_user_id: to_user_id
      }
    ])

  if (inviteError) throw new Error(inviteError.message);

  return fetchGroupInvites(group_id)
}

/**
 * Updates the status of an invite, if accepted inserts the user into the 'members' table for the group the invite was for
 * 
 * @param invite_id 
 * @param newStatus
 * 
 * @returns {Promise<Invite[]>} an array of invites either to a user if accepted or rejected, or an array of invites for a group if revoked
 */
export async function updateInvite (invite_id: string, newStatus: 'accepted' | 'rejected' | 'revoked'): Promise<Invite[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('invites')
    .update({ status: newStatus })
    .eq('invite_id', invite_id)
    .select('*')
    .single()

  if (error) throw new Error(error.message);

  const invite = data;

  if(newStatus === 'accepted'){
    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .insert([
        {
          user_id: invite.to_user_id,
          group_id: invite.group_id,
        }
      ])

    if (memberError) throw new Error(memberError.message)
  }

  if(newStatus === 'revoked') return fetchGroupInvites(invite.group_id)
  return fetchInvites(invite.to_user_id)
}