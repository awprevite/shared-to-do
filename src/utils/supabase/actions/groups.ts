'use server';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { User, Group, Member, Task, Invite } from '@/utils/database/types'

/**
 * Fetches the groups that a user is a member of
 * 
 * @param user_id the user ID to fetch groups for
 * 
 * @returns {Promise<Group[]>} an array of groups the user is a member of
 * @throws {Error} if the query fails
 */
export async function fetchGroups( user_id: string ): Promise<Group[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('members')
    .select('group_id, groups(*)')
    .eq('user_id', user_id)

  if (error) throw new Error(error.message)

  const groups = data?.map((entry: any) => entry.groups) ?? [];

  return groups;
}

/**
 * Inserts a group into the 'groups' table and inserts the creator into the 'members' table and redirects to the group dashhboard
 * 
 * @param name the name of the group
 * @param creator_id the user ID of the creator
 * 
 * @returns {Promise<void>}
 * @throws {Error} if the query fails
 */
export async function createGroup( name: string , creator_id: string ): Promise<void> {
  const supabase = await createClient()

  const { data: groupData, error: groupError } = await supabase
    .from('groups')
    .insert([
      {
        name: name,
        creator_id: creator_id
      }
    ])
    .select('*')
    .single()

  if (groupError) throw new Error(groupError.message);

  if (groupData){

    const group_id = groupData.group_id

    const { data: memberData, error: memberError } = await supabase
    .from('members')
    .insert([
      {
        user_id: creator_id,
        group_id: group_id,
        role: 'creator'
      }
    ])

    if (memberError) throw new Error(memberError.message)

    redirect(`/group/${group_id}`)
  }
}

/**
 * Deletes a group from the 'groups' table and redirects to the user dashboard
 * 
 * @param group_id the ID of the group
 * 
 * @returns {Promise<void>} 
 * @throws {Error} if the query fails
 * 
 */
export async function deleteGroup( group_id: string ): Promise<void> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('groups')
    .delete()
    .eq('group_id', group_id)

  if (error) throw new Error(error.message);

  redirect('/user')
}
