'user client';

type HeaderProps = {
  email: string;
  groupName?: string;
  buttonName?: string;
  onClick: () => void;
}

export default function Header ({ email, groupName='', buttonName, onClick }: HeaderProps) {

  return(
    <div className='flex w-full justify-between items-center bg-[var(--dark-accent)] px-6 py-3'>
      <p>{email}</p>
      <p>{groupName}</p>
      <button className='text-[var(--dark-accent)] bg-[var(--fg-color)] w-20 py-1 rounded-full transition-transform duration-300 hover:scale-105 cursor-pointer' onClick={onClick}>{buttonName}</button>
    </div>
  )
}