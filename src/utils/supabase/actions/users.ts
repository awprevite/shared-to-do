'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { User } from '@/utils/database/types'

/**
 * Fetches the authenticated user from the 'users' table
 * 
 * @returns {Promise<User | null>} the authenticated user or null if not authenticated
 * @throws {Error} if authentication or the query fails
 */
export async function fetchUser(): Promise<User | null> {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()

  if (authError) throw new Error(authError.message)

  if (authData.user) {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', authData.user.id)
      .single()

    if (userError) throw new Error(userError.message)

    return userData
  }
  return null
}