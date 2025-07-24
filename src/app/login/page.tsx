'use client';
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import { createUser, loginUser, logoutUser } from '../../utils/supabase/actions'

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const handleLoginUser = async () => {
    loginUser(email, password);
  }

  const handleCreateUser = async () => {
    createUser(email, password);
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen gap-6'>
      <input className='border border-solid border-[var(--fg-color)] p-2 w-sm rounded-lg focus:outline-none focus:ring-0' value={ email } onChange={ handleEmailChange } placeholder='Email' />
      <input className='border border-solid border-[var(--fg-color)] p-2 w-sm rounded-lg focus:outline-none focus:ring-0' value={ password } onChange={ handlePasswordChange } placeholder='Password' />
      <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={ handleLoginUser }>Login</button>
      <p>Or</p>
      <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={ handleCreateUser }>Create Account</button>
      <button className='bg-[var(--light-accent)] p-2 w-sm rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={() => router.push('/')}>Back to home</button>
      <div className='flex flex-col justify start w-sm gap-2'>
        <p>After pressing create account this page will stay the same, follow these steps:</p>
        <p>1. Check you email for confirmation and press confirm</p>
        <p>2. With your credentials present press login and you should be redirected to the user dashboard</p>
      </div>
    </div>
  )
}