import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useCursor } from '../context/CursorContext'

export default function CustomCursor() {
  const { cursorType } = useCursor()
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    
    // Add event listeners for hoverable elements automatically
    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, input, textarea, .hoverable')) {
        document.body.style.cursor = 'none'
      }
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleMouseOver)
    
    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [cursorX, cursorY])

  const variants = {
    default: {
      width: 16,
      height: 16,
      backgroundColor: 'var(--c-ink, #1a1917)',
      border: '0px solid transparent',
      mixBlendMode: 'difference'
    },
    hover: {
      width: 64,
      height: 64,
      backgroundColor: 'transparent',
      border: '1px solid var(--c-ink, #1a1917)',
      mixBlendMode: 'difference'
    }
  }

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
        pointerEvents: 'none',
        zIndex: 9999,
        borderRadius: '50%'
      }}
      variants={variants}
      animate={cursorType}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
  )
}
