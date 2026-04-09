import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const bannerVariants = {
  initial: {
    height: '100vh',
    bottom: 0,
  },
  animate: {
    height: 0,
    transition: {
      duration: 1,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  exit: {
    height: '100vh',
    top: 0,
    transition: {
      duration: 1,
      ease: [0.76, 0, 0.24, 1],
    },
  },
}

export default function PageMask() {
  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'var(--bg-primary, #f4efe6)',
        zIndex: 100,
        pointerEvents: 'none',
      }}
      variants={bannerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    />
  )
}
