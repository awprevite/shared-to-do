'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Notification({ message, onClear} : { message: string | null, onClear: () => void }) {

  useEffect(() => {
    if (!message) return
    const timeout = setTimeout(() => {
      onClear()
    }, 8000)

    return () => clearTimeout(timeout)
  }, [message, onClear])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 1 }}
          className='fixed top-0 left-1/2 -translate-x-1/2 w-full lg:w-1/2 bg-[var(--light-accent)] px-6 py-4 rounded-b-lg flex justify-between items-center gap-4 z-[9999]'
        >
          <p>{message}</p>
          <button onClick={onClear}>
            <X />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}