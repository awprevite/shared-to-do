import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

import GroupPage from './GroupPage'

type PageProps = {
  params: Promise<{ group_id: string }>
}

export default async function PrivateGroupPage({ params }: PageProps) {

  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()

  // Check if logged in
  if ( authError || !authData?.user ) {
    redirect('/login')
  }

  const { group_id } = await params

  // Check if user is in the group
  const { data, error } = await supabase
    .from('members')
    .select('group_id')
    .eq('user_id', authData.user.id)
    .eq('group_id', group_id)

   if ( !data || data.length === 0 || error ) {
    redirect('/user')
   }

  return (
    <GroupPage groupId={ group_id } />
  )
}