import { NextResponse } from 'next/server';
import { logoutUser } from '../../../../utils/supabaseDb'

/**
 * Handles user logout
 * 1. Deauthenticates user with Supabase Authentication
 * 
 * @param request - A POST Request object with JSON body (request.body):
 * {
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

  try {
    await logoutUser()
    return NextResponse.json({ message: 'logged out'}, {status: 200} )
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
