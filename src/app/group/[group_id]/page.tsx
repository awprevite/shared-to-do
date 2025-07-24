import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

import GroupPage from './GroupPage'

type Props = {
  params: {
    group_id: string;
  }
}

export default async function PrivateGroupPage(props: Props) {

  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()

  if ( authError || !authData?.user ) {
    redirect('/login')
  }

  const params = await props.params
  const group_id = params.group_id;

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