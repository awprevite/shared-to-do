'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Loading({ done }: { done: boolean }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (done) setProgress(100)
  }, [done])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 93) return p
        
        const boost = p < 60 
          ? Math.random() * 12
          : Math.random() * 5

        return Math.min(p + boost, 99)
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='z-50 flex flex-col h-screen items-center justify-center bg-[var(--dark-accent)]'>
      <Image alt='√' className='pb-6' src='/favicon.ico' width={64} height={64} />

      <div className='flex items-center'>

        <p className='text-sm text-muted-foreground px-2'>{Math.floor(progress)}%</p>

        <div className='w-64 h-1 bg-muted rounded-lg overflow-hidden'>
          <motion.div
            className='h-full bg-[var(--light-accent)]'
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>

      </div>
    </div>
  )
}
