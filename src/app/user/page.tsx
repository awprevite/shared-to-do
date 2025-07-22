'use client';
import Header from '../components/Header'
import List from '../components/List'
import { useRouter } from 'next/navigation'

export default function User() {

  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  }

  const handleAcceptInvite = () => {
    alert('Accepting Invite')
  }

  const handleRejectInvite = () => {
    alert('Rejecting Invite')
  }

  const handleGroupSelect = () => {
    router.push('/group')
  }

  return (
    <>
      <Header email='test@gmail.com' groupName='Test Name'/>
      <div className='flex flex-col justify-center items-center p-2 gap-2'>
        <List 
          title='invites'
          items={['Invite 1', 'Invite 2']} 
          renderItems={(name) => (
            <div className='flex w-full justify-between'>
              <p>{name}</p>
              <div className='flex gap-6'>
                <button onClick={handleAcceptInvite}>{'\u2713'}</button>
                <button onClick={handleRejectInvite}>{'\u2715'}</button>
              </div>
            </div>
          )}
          emptyMessage='No invites to display' 
        />
        <List title='groups'
          items={['Group 1']}
          renderItems={(name) => (
            <button onClick={handleGroupSelect}>{name}</button>
          )}
          emptyMessage='No groups to display'
        />
      </div>
    </>
  )
}