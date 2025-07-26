'use client' 
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { totalUsers, totalGroups } from '@/utils/supabase/actions/stats'
import { signUpUser, signInUser } from '@/utils/supabase/actions/auth'
import { Square, SquareCheckBig } from 'lucide-react'

export default function Login() {
 
  const router = useRouter();

  const [users, setUsers] = useState<number>(0);
  const [groups, setGroups] = useState<number>(0);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [status, setStatus] = useState<boolean>(false);
  const [state, setState] = useState<'Sign in' | 'Sign up'>('Sign in')

  const handleAuthenticate = async () => {
    try {
      if(state === 'Sign in') {
        await signInUser(email, password)
      } else if (state === 'Sign up') {
        await signUpUser(email, password)
        setStatus(true)
      }
    } catch (error) {
      console.error('Sign Authentication error: ', error)
    }
  }

  // useEffect(()  => {
  //   const fetchData = async () => {
  //     try {
  //       const [users, groups] = await Promise.all([totalUsers(), totalGroups()])
  //       setUsers(users);
  //       setGroups(groups);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   }
  //   fetchData();
  // }, [])

  return (
    <>
      {/* Entire screen */}
      <div className='flex'>

        {/* Left side screen */}
        <div className='flex flex-col justify-center items-center gap-6 bg-check h-screen w-full'>

          <p className='text-7xl pb-15'>Shared To Do</p>

          {/* Check list */}
          <div className='flex flex-col items-start gap-10'>

            {/* Check rows */}
            <div className='flex gap-4 justify-start items-center'>
              <SquareCheckBig />
              <p className='text-2xl p-2'>Multi-user to do and task lists</p>
            </div>

            <div className='flex gap-4 justify-start items-center'>
              <SquareCheckBig />
              <p className='text-2xl p-2'>{`Powering ${users} ${users == 1 ? 'user' : 'users'} and ${groups} ${groups == 1 ? 'group' : 'groups'}`}</p>
            </div>

            <div className='flex gap-4 justify-start items-center'>
              <Square />
              <p className='text-2xl p-2'>Access your dashboard to get started</p>
            </div>

          </div>
        </div>

        {/* Right side screen container */}
        <div className='flex flex-col justify-center items-center gap-2 bg-[var(--dark-accent)] h-screen w-full'>

          <p className='text-5xl p-10'>{state === 'Sign in' ? 'Sign In' : 'Sign Up'}</p>

          {/* Form */}
          <div className='flex flex-col justify-center items-center'>

            <input className='border border-solid border-[var(--fg-color)] p-2 w-sm rounded-lg focus:outline-none focus:ring-0' type='email' value={ email } onChange={ e => setEmail(e.target.value) } placeholder='Email' />
            <input className='border border-solid border-[var(--fg-color)] p-2 mt-6 mb-2 w-sm rounded-lg focus:outline-none focus:ring-0' type='password' value={ password } onChange={ e => setPassword(e.target.value) } placeholder='Password' />

            {state === 'Sign in' ? (
              <div className='flex justify-start w-full gap-2'>
                <p className='text-sm'>Forgot password?</p>
                <button className='text-sm font-semibold' onClick={() => alert('Need to implement reset password')}>Reset</button>
              </div>
            ) : (
              <p className='text-sm'>&nbsp;</p>
            )}
            
            <button className='bg-[var(--light-accent)] p-2 mt-6 mb-2 w-sm rounded-lg' onClick={ handleAuthenticate }>{state}</button>

            { state === 'Sign in' ? (
              <div className='flex justify-start w-full gap-2'>
                <p className='text-sm'>Don't have an account?</p>
                <button className='text-sm font-semibold' onClick={() => setState('Sign up')}>Sign Up</button>
              </div>
            ) : (
              <div className='flex justify-start w-full gap-2'>
                <p className='text-sm'>Already have an account?</p>
                <button className='text-sm font-semibold' onClick={() => setState('Sign in')}>Sign In</button>
              </div>
            )}

            <div className='flex items-center w-full mt-8'>
              <hr className='flex-grow border-t border' />
              <p className='px-4'>or</p>
              <hr className='flex-grow border-t border' />
            </div>

            <button className='flex justify-center items-center border border-solid border-[var(--fg-color)] p-2 mt-6 mb-2 w-sm rounded-lg' onClick={ () => alert('Need to implement authenticate with google') }>

              {/* Google logo */}
              <svg className="w-5 h-5 mr-2" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34-4.6-50.2H272v95h146.9c-6.3 33.7-25.4 62.2-54.1 81.3v67h87.1c51-47 81.6-116.2 81.6-193.1z"/>
                <path fill="#34A853" d="M272 544.3c73.6 0 135.4-24.5 180.5-66.7l-87.1-67c-24.2 16.3-55 25.9-93.4 25.9-71.7 0-132.4-48.3-154.2-113.1h-90.3v70.6c45 88.3 136.6 150.3 244.5 150.3z"/>
                <path fill="#FBBC04" d="M117.8 323.4c-10.6-31.7-10.6-65.6 0-97.3v-70.6H27.5C-8.5 217.7-8.5 326.6 27.5 388z"/>
                <path fill="#EA4335" d="M272 107.7c39.9-.6 77.7 13.7 106.6 39.5l80-80C407.5 24.8 342.7-.4 272 0 164.1 0 72.5 61.9 27.5 150.2l90.3 70.6C139.6 156 200.3 107.7 272 107.7z"/>
              </svg>

              {state} with Google
            </button>

            {/* Sign up next steps */}
            { status && (
              <div className='flex flex-col text-center'>
                <p className='text-4xl text-[var(--success)] p-2'>Account Created</p>
                <p className='w-md'>Please check your email and confirm your account, then return to this page to log in</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
