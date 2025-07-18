import { NextResponse } from 'next/server';
import supabase from '@/utils/supabaseConnection'

/**
 * Handles user deactivation
 * 1. Sets `active = false` for the specified user in the 'users' table
 * 
 * @param request - A POST Request object with JSON body (request.body):
 * {
 *   id: string;
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

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400} );
  }

  const { data , error } = await supabase
    .from('users')
    .update({ active: false })
    .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400} );
    }

    return NextResponse.json({ message: 'User deactivated successfully' }, { status: 200 });

}
