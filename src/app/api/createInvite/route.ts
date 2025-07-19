import { NextResponse } from 'next/server';
import supabase from '@/utils/supabaseConnection'

/**
 * Handles invite creation
 * 1. Adds an invite to the 'invites' table in the database
 * 
 * @param request - A POST Request object with JSON body (request.body):
 * {
 *   group_id : int;
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

  const { group_id, from_id, to_id } = await request.json();

  const { data, error } = await supabase
    .from('invites')
    .insert([
      {
        group_id: group_id,
        from_id: from_id,
        to_id: to_id
      }
    ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400} );
  }

  return NextResponse.json({ message: 'Invite created successfully' }, { status: 200 });

}
