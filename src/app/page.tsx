'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {

  const handleLogin = async () => {

    try {

      const response = await fetch('/api/users/loginUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('login response error:', result.error);
        throw new Error(result.error || 'Something went wrong');
      }

      console.log('User loggedin:', result);

      router.push('/user')

    } catch (error) {

      console.error('login error:', error);

    }
  }

  const handleSignup = async () => {
    try{

      const response = await fetch('/api/users/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      console.log('User created:', result);

      router.push('/user')

    } catch (error) {

      console.error('Signup error:', error);

    }
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const setLogin = () => {
    setMode('login');
  }

  const setSignup = () => {
    setMode('signup');
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen'>

      <p className='text-4xl p-6'>Shared To Do</p>
      <p className='text-lg p-6'>Multi-user to do and task lists</p>
      <p className='text-lg p-6'>Powering X users and Y groups</p>
      <div className='flex flex-col justify-center items-center gap-6 bg-[var(--dark-accent)] rounded-lg px-20 py-6 max-w-sm'>
        <input className='border border-solid border-[var(--fg-color)] p-2 rounded-lg focus:outline-none focus:ring-0' value={email} onChange={handleEmailChange} placeholder='Email' />
        <input className='border border-solid border-[var(--fg-color)] p-2 rounded-lg focus:outline-none focus:ring-0' value={password} onChange={handlePasswordChange} placeholder='Password' />
        <button className='bg-[var(--light-accent)] p-2 w-full rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={ mode === 'login' ? handleLogin : handleSignup }> {mode === 'login' ? 'Login' : 'Sign up'}</button>
        <p>Or</p>
        <button className='border-[var(--light-accent)] border-2 w-1/2 rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={ mode === 'login' ? setSignup : setLogin }> {mode === 'login' ? 'Sign up' : 'Login'}</button>
      </div>

      <p className='text-[var(--error-red)] p-6'>{errorMessage || '\u00A0'}</p>
    </div>
  );
}
