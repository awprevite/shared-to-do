import { NextResponse } from 'next/server';
import { createUser } from '../../../../utils/supabaseDb'

/**
 * Handles user sign up
 * 1. Registers user with Supabase Authentication
 * 2. Adds the user to the 'users' table in the database
 * 
 * @param request - A POST Request object with JSON body (request.body):
 * {
 *   email: string;
 *   password: string;
 * }
 * 
 * @returns { NextResponse } A JSON response:
 * 
 * 200 OK:
 * { 
 *   message: string;
 *   user: SupabaseUser;
 * }
 * 
 * 400 Bad Request:
 * { 
 *   error: string;
 * }
 */

export async function POST(request: Request) {

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400} );
  }

  try {
    const body = await createUser(email, password)
    return NextResponse.json({ body: body}, {status: 200} )
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 })
  }
}
