'use server';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { User, Group, Member, Task, Invite } from '@/utils/database/types'

/**
 * Fetches the members of a group from the 'members' table
 * 
 * @param group_id the ID of the group to fetch members for
 * 
 * @returns {Promise<Member[]>} an array of members in the group
 * @throws {Error} if the query fails
 */
export async function fetchMembers( group_id: string ): Promise<Member[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('group_id', group_id)

  if (error) throw new Error(error.message)

  return data
}

/**
 * Checks if a user is an admin or creator of a group
 * 
 * @param group_id the ID of the group to check
 * @param user_id the ID of the user to check
 * 
 * @returns {Promise<'member' | 'admin' | 'creator'>}
 * @throws {Error} if the query fails
 */
export async function checkAccess( group_id: string, user_id: string ): Promise<'member' | 'admin' | 'creator'> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('members')
    .select('role')
    .eq('group_id', group_id)
    .eq('user_id', user_id)
    .single()

  if (error) throw new Error(error.message)

  return data.role
}

/**
 * Updates the role of a member in a group
 * 
 * @param group_id the ID of the group the member is in
 * @param user_id the ID of the user whose role is being updated
 * @param new_role the new role to set for the member
 * 
 * @returns {Promise<Member[]>} the updated list of members in the group
 * @throws {Error} if the query fails
 */
export async function updateMemberRole( group_id: string, user_id: string, new_role: 'admin' | 'member' ): Promise<Member[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('members')
    .update({ role: new_role })
    .eq('group_id', group_id)
    .eq('user_id', user_id)

  if (error) throw new Error(error.message)

  const { data: members, error: fetchError } = await supabase
    .from('members')
    .select('*')
    .eq('group_id', group_id)

  if (fetchError) throw new Error(fetchError.message)

  return members
}

/**
 * Deletes a member from a group
 * 
 * @param group_id the ID of the group the member is in
 * @param user_id the ID of the user to delete from the group
 * 
 * @returns {Promise<Member[]>} an array of the remaining members in the group
 * @throws {Error} if the query fails
 */
export async function deleteMember(group_id: string, user_id: string): Promise<Member[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('members')
    .delete()
    .eq('group_id', group_id)
    .eq('user_id', user_id)

  if(error) throw new Error(error.message)

  const { data: remainingMembers, error: fetchError } = await supabase
    .from('members')
    .select('*')
    .eq('group_id', group_id)

  if (fetchError) throw new Error(fetchError.message)

  return remainingMembers
}