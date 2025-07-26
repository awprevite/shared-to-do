'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { User, Group, Member, Task, Invite } from '@/utils/database/types'

/**
 * Fetches the authenticated user from supabase
 * 
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
      .single()

    if (dbError) throw new Error(dbError.message)

    return dbData
  }
  return null;
}

/**
 * Updates the user's 'active' attribute in the 'users' table 
 * 
 * @param user_id the ID of the user to update 
 * @param new_status the new status to set for the user
 * 
 * @returns the updated user data
 */
export async function updateUser( user_id: string, new_status: boolean ): Promise<User> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .update({ active: new_status })
    .eq('user_id', user_id)
    .select('*')
    .single()

    if (error) throw new Error(error.message)

    return data
}