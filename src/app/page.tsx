'use client'

export default function Home() {

  const handleCreateUser = async () => {

    const email = 'awprevite@gmail.com';
    const password = 'password';

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
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='flex bg-blue-500/40 rounded-lg justify-center items-center'>
        <button className='text-3xl p-6 transition 100 active:scale-110' onClick={ handleCreateUser }>Create User</button>
      </div>
    </div>
  );
}
