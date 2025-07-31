'use client'

type HeaderProps = {
  email: string;
  groupName?: string;
  buttonName?: string;
  onClick: () => void;
}

export default function Header ({ email, groupName='', buttonName, onClick }: HeaderProps) {

  return(
    <>
      {/* Desktop view*/}
      <div className='relative hidden md:flex w-full items-center bg-[var(--dark-accent)] px-6 py-3'>
        <p className='flex-shrink-0'>{email}</p>
        <p className='absolute left-1/2 -translate-x-1/2'>{groupName}</p>
        <button className='ml-auto flex-shrink-0 text-[var(--dark-accent)] bg-[var(--fg-color)] w-20 py-1 rounded-full' onClick={onClick}>{buttonName}</button>
      </div>

      {/* Mobile view */}
      <div className='flex flex-col w-full items-center bg-[var(--dark-accent)] p-3 md:hidden'>
        <div className='flex w-full items-center bg-[var(--dark-accent)] px-6 py-3'>
          <p>{email}</p>
          <button className='ml-auto text-[var(--dark-accent)] bg-[var(--fg-color)] w-20 py-1 rounded-full' onClick={onClick}>{buttonName}</button>
        </div>
        <p>{groupName}</p>
      </div>
    </>
  )
}