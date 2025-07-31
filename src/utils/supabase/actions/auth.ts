'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

/**
 * Signs up a user with supabase authentication
 * Inserts into the 'users' table once user sign up has been confirmed via email
 * 
 * @param email the users email
 * @param password the users password
 * 
 * @return {Promise<void>} 
 * @throws {Error} if authentication sign up fails
 */
export async function signUpUser( email: string, password: string ): Promise<void> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) throw new Error(error.message)
}

/**
 * Signs in a user with supabase authentication
 * Redirects to the user page
 * 
 * @param email the users email
 * @param password the users password
 * 
 * @return {Promise<void>}
 * @throws {Error} if authentication sign in fails
 */
export async function signInUser( email: string, password: string ): Promise<void> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new Error(error.message)

  redirect('/user')
}

/**
 * Signs out a user from supabase authentication
 * Redirects to the home page
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