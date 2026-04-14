import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, y: 20 },
  enter: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] }  
  }
}

export default function PageTransition({ children, style, className, noPadding }) {
  return (
    <motion.main
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={className}
      style={{
        paddingTop: noPadding ? 0 : '8rem',
        paddingBottom: noPadding ? 0 : '6rem',
        paddingLeft: noPadding ? 0 : '2rem',
        paddingRight: noPadding ? 0 : '2rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style
      }}
    >
      {children}
    </motion.main>
  )
}

