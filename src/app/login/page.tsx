'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signUpUser, signInUser } from '../../utils/supabase/actions'

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [status, setStatus] = useState<boolean>(false);

  const handleSignInUser = async () => {
    try {
      await signInUser(email, password);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }

  const handleSignUpUser = async () => {
    try {
      await signUpUser(email, password);
    } catch (error) {
      console.error('Error signing up:', error);
    }

    setStatus(true);
  }

  return (
    <div className='flex flex-col justify-center items-center gap-6 translate-y-50'>
      <p className='text-7xl p-10'>Shared To Do</p>
      <div className='flex flex-col justify-center items-center gap-6'>
        <input className='border border-solid border-[var(--fg-color)] p-2 w-sm rounded-lg focus:outline-none focus:ring-0' type='email' value={ email } onChange={ e => setEmail(e.target.value) } placeholder='Email' />
        <input className='border border-solid border-[var(--fg-color)] p-2 w-sm rounded-lg focus:outline-none focus:ring-0' type='password' value={ password } onChange={ e => setPassword(e.target.value) } placeholder='Password' />
        <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={ handleSignInUser }>Login</button>
        <p>Or</p>
        <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={ handleSignUpUser }>Create Account</button>
        <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => router.push('/')}>Back to home</button>
        { status && (
          <div className='flex flex-col text-center'>
            <p className='text-4xl text-[var(--success)] p-2'>Account Created</p>
            <p className='w-md'>Please check your email and confirm your account, then return to this page to log in</p>
          </div>
        )}
      </div>
    </div>
  )
}