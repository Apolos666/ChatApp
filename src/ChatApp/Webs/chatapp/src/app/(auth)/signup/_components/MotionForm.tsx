import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

function MotionForm({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{
        translateX: 0,
        opacity: 1
      }}
      exit={{
        translateX: -100,
        opacity: 0
      }}
      transition={{
        duration: 0.15
      }}
    >
      {children}
    </motion.div>
  )
}

export default MotionForm
