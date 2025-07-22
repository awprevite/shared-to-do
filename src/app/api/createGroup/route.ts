import { NextResponse } from 'next/server';
import supabase from '@/utils/supabaseConnection'

/**
 * Handles group creation
 * 1. Adds a group to the 'groups' table in the database
 * 
 * @param request - A POST Request object with JSON body (request.body):
 * {
 *   name: string;
 *   manager: string;
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

  const { name, manager } = await request.json();

  const { data, error } = await supabase
    .from('groups')
    .insert([
      {
        name: name,
        manager: manager,
      }
    ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400} );
  }

  return NextResponse.json({ message: 'User created successfully' }, { status: 200 });

}
