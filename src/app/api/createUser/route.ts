import { NextResponse } from 'next/server';
import supabase from '@/utils/supabaseConnection'

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

  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

  if(authError) {
    return NextResponse.json({ error: authError.message }, { status: 400} );
  }

  if (authData.user) {
    const { data: dbData, error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: authData.user.email,
        }
      ]);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400} );
    }

    return NextResponse.json({ message: 'User created successfully', user: authData.user }, { status: 200 });

  }
}
