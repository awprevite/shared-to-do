'use client';
import Header from '../components/Header'
import List from '../components/List'
import { useRouter } from 'next/navigation'

export default function Group(){

  const router = useRouter();

  const handleExitGroup = () => {
    router.push('/user')
  }

  const handleClaimTask = () => {
    
  }

  const handleCompleteTask = () => {

  }
  

  return(
    <>
      <Header email='test@gmail.com' groupName='Test Group Name' buttonName='Back' onClick={handleExitGroup}/>
      <List 
        title='tasks'
        items={[{name: 'Task 1', claim: '', complete: false}]}
        renderItems={({ name, claim, complete }) => (
          <div className='flex w-full justify-between'>
            <p>{name}</p>
            <button onClick={handleClaimTask}>{claim ? `${claim} \u25A0` : 'Claim \u25A1' }</button>
            <button onClick={handleClaimTask}>{complete ? `${complete} \u25A0` : 'Complete \u25A1'}</button>
          </div>
        )}
        emptyMessage='No tasks to display'
      />
      <List 
        title='members'
        items={['Member 1', 'Member 2']}
        renderItems={(name) => (
          <div className='flex w-full justify-between'>
            <p>{name}</p>
          </div>
        )}
        emptyMessage='No members to display'
      />
    </>
  )
}