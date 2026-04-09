import { createContext, useContext, useState } from 'react'

const CursorContext = createContext()

export function CursorProvider({ children }) {
  const [cursorType, setCursorType] = useState('default')
  
  const handleMouseEnter = () => setCursorType('hover')
  const handleMouseLeave = () => setCursorType('default')

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType, handleMouseEnter, handleMouseLeave }}>
      {children}
    </CursorContext.Provider>
  )
}

export function useCursor() {
  return useContext(CursorContext)
}
