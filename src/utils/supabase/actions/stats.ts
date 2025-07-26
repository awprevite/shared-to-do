'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { User, Group, Member, Task, Invite } from '@/utils/database/types'

/**
 * Gets the total number of users in the 'users' table
 * 
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
 * Gets the total number of groups in the 'groups' table
 * 
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