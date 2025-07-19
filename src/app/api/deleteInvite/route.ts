import { NextResponse } from 'next/server';
import supabase from '@/utils/supabaseConnection'

/**
 * Handles invite deletion
 * 1. Deletes an invite from the 'invites' table in the database if it has status pending
 * 
 * @param request - A POST Request object with JSON body (request.body):
 * {
 *   group_id: int;
 *   from_user: string;
 *   to_user: string;
 * }
 * 
 * @returns { NextResponse } A JSON response:
 * 
 * 200 OK:
 * { 
 *   message: string;
 * }
 * 
 * 400 Bad Request:
 * { 
 *   error: string;
 * }
 */

export async function POST(request: Request) {

  const { group_id, from_user, to_user } = await request.json();

  const { data, error } = await supabase
    .from('invites')
    .delete()
    .eq('group_id', group_id)
    .eq('from_user', from_user)
    .eq('to_user', to_user)
    .eq('status', 'pending')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 } );
  }

  // or data.length === 0
  if(!data) {
    return NextResponse.json({ error: 'No existing invite, or the invite has already been accepted or rejected'}, { status: 400 })
  }

  return NextResponse.json({ message: 'Invite deleted successfully' }, { status: 200 });

}
