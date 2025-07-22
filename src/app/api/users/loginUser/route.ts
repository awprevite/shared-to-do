import { NextResponse } from 'next/server';
import { loginUser } from '../../../../utils/supabaseDb'

/**
 * Handles user log in
 * 1. Authenticates user with Supabase Authentication
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
    const body = await loginUser(email, password)
    return NextResponse.json({ body: body}, {status: 200} )
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
