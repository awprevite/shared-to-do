'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Notification({ message, onClear} : { message: string | null, onClear: () => void }) {

  return (
    <>
      {/* Notification bar */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className='fixed top-0 left-0 right-0 z-50 bg-[var(--light-accent)] text-[var(--fg-color)] px-6 py-4 shadow-md flex justify-between items-center'
          >
            <p className='text-sm font-medium'>{message}</p>
            <button onClick={onClear}>
              <X className='w-5 h-5' />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}