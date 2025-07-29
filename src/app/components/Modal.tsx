'use client'

type ModalProps = {
  action: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function Modal({ action, onCancel, onConfirm }: ModalProps) {
  
  return (
    <div className='fixed inset-0 z-[9988] flex flex-col justify-center items-center p-4'>

      {/* Backdrop blur */}
      <div className='absolute inset-0 bg-[var(--bg-color)]/10 backdrop-blur-sm' onClick={onCancel} />

      <div className='relative z-10 flex flex-col items-center bg-[var(--dark-accent)] rounded-lg gap-4 p-6 w-full max-w-lg shadow-xl'>
        <p className='text-2xl font-semibold'>{`${action}?`}</p>
        <p>This cannot be undone</p>
        <div className='flex gap-4'>
          <button className='bg-[var(--light-accent)] rounded-lg w-20' onClick={onCancel}>Cancel</button>
          <button className='bg-[var(--fg-color)] text-[var(--dark-accent)] rounded-lg w-20' onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}