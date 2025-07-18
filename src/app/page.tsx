'use client'
import { useState } from 'react'

export default function Home() {

  const id = 1
  const name = 'Group Name'
  const manager = '1f0fb479-77b5-4c88-b907-fd1cfd079abf'

  const handleCreateGroup = async () => {

    try {
      const response = await fetch('api/createGroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, manager })
      })

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      console.log('Game created');

    } catch (error) {

      console.error('Error:', error);

    }
    
  }

  const handleDeleteGroup = async () => {

    try {
      const response = await fetch('api/deleteGroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      console.log('Game deleted');

    } catch (error) {

      console.error('Error:', error);

    }
    
  }

  const handleCreate = async () => {

    try{

      const response = await fetch('/api/createUser', {
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

      console.log('User created:', result.user);

    } catch (error) {

      console.error('Signup error:', error);

    }
  }

  const handleLogin = async () => {

  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);
  const [create, setCreate] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const showLogin = () => setLogin(true)
  const hideLogin = () => setLogin(false)

  const showCreate = () => setCreate(true)
  const hideCreate = () => setCreate(false)

  return (
    <div className='flex flex-col justify-center items-center h-screen'>

      <button onClick={handleCreateGroup}>Create Group</button>
      <button onClick={handleDeleteGroup}>Delete Group</button>


      <p className='text-4xl p-6'>Shared To Do</p>
      <p className='text-xl p-6'>Multi-user to do and task lists</p>
      <p className='text-xl p-6'>Powering X users and Y groups</p>
      <div className='flex justify-center items-center gap-6'>
        <button className='bg-blue-500/40 rounded-lg text-xl p-2 transition 100 active:scale-90 hover:scale-110' onClick={ showLogin }>Login User</button>
        <button className='bg-blue-500/40 rounded-lg text-xl p-2 transition 100 active:scale-90 hover:scale-110' onClick={ showCreate }>Create User</button>
      </div>
      {login && (
        <div className='flex flex-col justify-center items-center gap-6 p-6'>
          <input value={email} onChange={handleEmailChange} placeholder='Enter email' />
          <input value={password} onChange={handlePasswordChange} placeholder='Enter password' />
          <div className='flex gap-6'>
          <button className='bg-blue-500/40 rounded-lg text-xl p-2 transition 100 active:scale-90 hover:scale-110' onClick={ handleLogin }>Submit</button>
          <button className='bg-red-500/40 rounded-lg text-xl p-2 transition 100 active:scale-90 hover:scale-110' onClick={ hideLogin }>Back</button>
          </div>
        </div>
      )}
      {create && (
        <div className='flex flex-col justify-center items-center gap-6 p-6'>
          <input className='p-6' value={email} onChange={handleEmailChange} placeholder='Enter email' />
          <input className='p-6' value={password} onChange={handlePasswordChange} placeholder='Enter password' />
          <div className='flex gap-6'>
            <button className='bg-blue-500/40 rounded-lg text-xl p-2 transition 100 active:scale-90 hover:scale-110' onClick={ handleCreate }>Submit</button>
            <button className='bg-red-500/40 rounded-lg text-xl p-2 transition 100 active:scale-90 hover:scale-110' onClick={ hideCreate }>Back</button>
          </div>
        </div>
      )}
    </div>
  );
}
