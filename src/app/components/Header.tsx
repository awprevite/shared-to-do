'user client';

type HeaderProps = {
  email: string;
  groupName: string;
}

export default function Header ( {email, groupName}: HeaderProps) {

  return(
    <div className='flex w-full justify-between bg-blue-400/20'>
      <p>{email}</p>
      <p>{groupName}</p>
      <button>Log out</button>
    </div>
  )
}