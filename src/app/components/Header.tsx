'user client';
import { useRouter } from 'next/navigation'

type HeaderProps = {
  email: string;
  groupName: string;
}

export default function Header ( {email, groupName}: HeaderProps) {

  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  }

  return(
    <div className='flex w-full justify-between items-center bg-[var(--dark-accent)] px-6 py-2'>
      <p>{email}</p>
      <p>{groupName}</p>
      <button className='bg-[var(--light-accent)] px-2 py-1 rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={handleLogout}>Log out</button>
    </div>
  )
}