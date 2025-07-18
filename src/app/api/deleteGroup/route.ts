import { NextResponse } from 'next/server';
import supabase from '@/utils/supabaseConnection'

/**
 * Handles group deletion
 * 1. Deletes a group to the 'groups' table in the database
 * 
 * @param request - A POST Request object with JSON body (request.body):
 * {
 *   id: int;
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

  const { data, error } = await supabase
    .from('groups')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400} );
  }

  return NextResponse.json({ message: 'User created successfully' }, { status: 200 });

}
