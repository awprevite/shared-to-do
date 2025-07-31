import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

import UserPage from './UserPage'

export default async function PrivateUserPage() {
  const supabase = await createClient()

  // Check if logged in
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <UserPage />
  )
}