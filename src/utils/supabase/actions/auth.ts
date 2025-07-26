'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { User, Group, Member, Task, Invite } from '@/utils/database/types'

/**
 * Signs up a user with supabase authentication and inserts into the 'users' table
 * 
 * @param email the users email
 * @param password the users password
 * 
 * @return {Promise<void>} 
 * @throws {Error} if authentication sign up or the query fails
 */
export async function signUpUser( email: string, password: string ): Promise<void> {
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

    if (dbError) throw new Error(dbError.message)
  }
}

/**
 * Signs in a user with supabase authentication and redirects to the user dashboard
 * 
 * @param email the users email
 * @param password the users password
 * 
 * @return {Promise<void>}
 * @throws {Error} if authentication sign in fails or the query fails
 */
export async function signInUser( email: string, password: string ): Promise<void> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new Error(error.message)

  redirect('/user')
}

/**
 * Signs out a user from supabase authentication and redirects to the home page
 * 
 * @returns {Promise<void>}
 * @throws {Error} if authentication sign out fails
 */
export async function signOutUser(): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) throw new Error(error.message)

  redirect('/')
}