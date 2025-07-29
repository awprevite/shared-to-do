'use client' 
import { useState, useEffect } from 'react'
import { totalUsers, totalGroups } from '@/utils/supabase/actions/stats'
import { signUpUser, signInUser } from '@/utils/supabase/actions/auth'
import { mapSupabaseError } from '@/utils/supabase/errors/errors'
import { Square, SquareCheckBig, Eye, EyeOff } from 'lucide-react'
import Notification from '../components/Notification'

export default function Login() {

  const [users, setUsers] = useState<number>(0)
  const [groups, setGroups] = useState<number>(0)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [state, setState] = useState<'Sign in' | 'Sign up'>('Sign in')
  const [message, setMessage] = useState<string | null>(null)
  const triggerNotification = (message: string) => setMessage(message)

  const handleAuthenticate = async () => {
    try {
      if(state === 'Sign in') {
        await signInUser(email, password)
      } else if (state === 'Sign up') {
        await signUpUser(email, password)
        triggerNotification('Account created, please check your email and confirm your account, then return to this page to log in')
      }
    } catch (error) {
      if (error instanceof Error) triggerNotification(mapSupabaseError(error))
    }
  }

  useEffect(()  => {
    const fetchData = async () => {
      try {
        const [users, groups] = await Promise.all([totalUsers(), totalGroups()])
        setUsers(users);
        setGroups(groups);
      } catch (error) {
        if (error instanceof Error) triggerNotification(mapSupabaseError(error))
      }
    }
    fetchData();
  }, [])

  return (
    <>
      <Notification message={message} onClear={() => setMessage(null)} />

      {/* Entire screen */}
      <div className='flex flex-col md:flex-row h-scren'>

        {/* Left side screen */}
        <div className='hidden lg:flex flex-col justify-center items-center gap-6 bg-check h-screen w-1/2'>

          <p className='text-5xl md:text-7xl pb-15'>Shared To Do</p>

          {/* Check list */}
          <div className='flex flex-col items-start gap-10 max-w-xl'>

            {/* Check rows */}
            <div className='flex gap-4 justify-start items-center p-2'>
              <SquareCheckBig className='min-w-6'/>
              <p className='text-2xl'>Multi-user to do and task lists</p>
            </div>

            <div className='flex gap-4 justify-start items-center p-2'>
              <SquareCheckBig className='min-w-6'/>
              <p className='text-2xl'>{`Powering ${users} ${users == 1 ? 'user' : 'users'} and ${groups} ${groups == 1 ? 'group' : 'groups'}`}</p>
            </div>

            <div className='flex gap-4 justify-start items-center p-2'>
              <Square className='min-w-6'/>
              <p className='text-2xl'>Access your dashboard to get started</p>
            </div>

          </div>
        </div>

        {/* Right side screen container */}
        <div className='flex flex-col justify-center items-center p-4 gap-2 bg-[var(--dark-accent)] w-full lg:w-1/2 h-screen'>

          <p className='text-5xl p-6'>{state === 'Sign in' ? 'Sign In' : 'Sign Up'}</p>

          {/* Form */}
          <div className='flex flex-col justify-center items-center w-full max-w-sm'>

            {/* Inputs */}
            <input className='border border-solid border-[var(--fg-color)] p-2 rounded-lg w-full focus:outline-none focus:ring-0' type='email' value={ email } onChange={ e => setEmail(e.target.value) } placeholder='Email' />

            <div className='flex justify-between border border-solid border-[var(--fg-color)] p-2 mt-6 mb-2 rounded-lg w-full'>
              <input className='w-full focus:outline-none focus:ring-0' type={showPassword ? 'text' : 'password'} value={ password } onChange={ e => setPassword(e.target.value) } placeholder='Password' />
              <button onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</button>
            </div>
            
            {/* Reset password or hold space */}
            {state === 'Sign in' ? (
              <div className='flex justify-start w-full gap-2'>
                <p className='text-sm'>Forgot password?</p>
                <button className='text-sm font-semibold' onClick={() => triggerNotification('Reset password coming soon...')}>Reset</button>
              </div>
            ) : (
              <p className='text-sm'>&nbsp;</p>
            )}
            
            <button className='bg-[var(--light-accent)] p-2 mt-6 mb-2 w-full rounded-lg' onClick={ handleAuthenticate }>{state}</button>

            {/* Toggle sign in / sign up */}
            { state === 'Sign in' ? (
              <div className='flex justify-start w-full gap-2'>
                <p className='text-sm'>Don&apos;t have an account?</p>
                <button className='text-sm font-semibold' onClick={() => setState('Sign up')}>Sign Up</button>
              </div>
            ) : (
              <div className='flex justify-start w-full gap-2'>
                <p className='text-sm'>Already have an account?</p>
                <button className='text-sm font-semibold' onClick={() => setState('Sign in')}>Sign In</button>
              </div>
            )}

            {/* Divider */}
            <div className='flex items-center w-full mt-6'>
              <hr className='w-full max-w-4xl border-t border my-6' />
              <p className='px-4'>or</p>
              <hr className='w-full max-w-4xl border-t border my-6' />
            </div>

            {/* Google sign in */}
            <button className='flex justify-center items-center border border-solid border-[var(--fg-color)] p-2 mt-6 mb-2 w-full rounded-lg' onClick={ () => triggerNotification('Authenticate with Google coming soon...') }>

              {/* Google logo */}
              <svg className="w-5 h-5 mr-2" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34-4.6-50.2H272v95h146.9c-6.3 33.7-25.4 62.2-54.1 81.3v67h87.1c51-47 81.6-116.2 81.6-193.1z"/>
                <path fill="#34A853" d="M272 544.3c73.6 0 135.4-24.5 180.5-66.7l-87.1-67c-24.2 16.3-55 25.9-93.4 25.9-71.7 0-132.4-48.3-154.2-113.1h-90.3v70.6c45 88.3 136.6 150.3 244.5 150.3z"/>
                <path fill="#FBBC04" d="M117.8 323.4c-10.6-31.7-10.6-65.6 0-97.3v-70.6H27.5C-8.5 217.7-8.5 326.6 27.5 388z"/>
                <path fill="#EA4335" d="M272 107.7c39.9-.6 77.7 13.7 106.6 39.5l80-80C407.5 24.8 342.7-.4 272 0 164.1 0 72.5 61.9 27.5 150.2l90.3 70.6C139.6 156 200.3 107.7 272 107.7z"/>
              </svg>

              {state} with Google
            </button>

          </div>
        </div>
      </div>
    </>
  )
}
