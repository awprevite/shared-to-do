import { NextResponse } from 'next/server';
import supabase from '@/utils/supabaseConnection'

export async function POST(request: Request) {

  const body = await request.json();
  const email = body.email
  const password = body.password

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
