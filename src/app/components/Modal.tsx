'use client'

import { motion, AnimatePresence } from 'framer-motion'

type ModalProps = {
  action: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function Modal({ action, onCancel, onConfirm }: ModalProps) {
  
  return (
    <AnimatePresence>
      <motion.div className='fixed inset-0 z-[9988] flex flex-col justify-center items-center p-4'
        initial={{ opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
      >

        {/* Backdrop blur */}
        <motion.div className='absolute inset-0 bg-[var(--fg-color)]/10 backdrop-blur-sm' onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        />

        <motion.div className='relative z-10 flex flex-col items-center bg-[var(--dark-accent)] rounded-lg gap-4 p-6 w-full max-w-lg shadow-xl text-center'
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <p className='text-2xl font-semibold'>{`${action}?`}</p>
          <p>This is a destructive action</p>
          <div className='flex gap-4'>
            <button className='bg-[var(--light-accent)] rounded-lg w-20' onClick={onCancel}>Cancel</button>
            <button className='bg-[var(--fg-color)] text-[var(--dark-accent)] rounded-lg w-20' onClick={onConfirm}>Confirm</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}