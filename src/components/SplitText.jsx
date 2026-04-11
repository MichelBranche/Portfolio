import { useRef, useState, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function SplitText({ children, type = 'lines,chars', delay = 0, scroll = false, className = '', ready = true, contentKey = '' }) {
  const textRef = useRef()
  const splitRef = useRef(null)
  const [isSplit, setIsSplit] = useState(false)

  // 1. DOM Splitting (Solo quando il testo cambia)
  useLayoutEffect(() => {
    if (!textRef.current) return

    // Revert previous split first
    if (splitRef.current) {
      splitRef.current.revert()
    }

    // Kill any in-progress animations on this element
    gsap.killTweensOf(textRef.current)

    // Reset state before re-splitting
    setIsSplit(false)

    // Create new split
    splitRef.current = new SplitType(textRef.current, { 
      types: type,
      tagName: 'span' 
    })

    // Hide while waiting for animation
    gsap.set(textRef.current, { opacity: 0 })

    setIsSplit(true)

    return () => {
      if (splitRef.current) {
        splitRef.current.revert()
        splitRef.current = null
      }
      setIsSplit(false)
    }
  }, [type, contentKey, children])


  // 2. Animation (Quando ready è true o scroll triggera)
  useGSAP(() => {
    if (!isSplit || !ready || !textRef.current || !splitRef.current) return

    const split = splitRef.current
    const targets = []
    
    if (type.includes('chars')) targets.push(...(split.chars || []))
    else if (type.includes('words')) targets.push(...(split.words || []))
    else if (type.includes('lines')) targets.push(...(split.lines || []))

    if (targets.length === 0) {
      gsap.to(textRef.current, { opacity: 1, duration: 0.1 })
      return
    }

    // Sequenza di reveal pulita
    const tl = gsap.timeline({
      scrollTrigger: scroll ? {
        trigger: textRef.current,
        start: 'top 88%',
        toggleActions: 'play none none none'
      } : null
    })

    tl.set(textRef.current, { opacity: 1 })
    tl.from(targets, {
      opacity: 0,
      y: type.includes('chars') ? 96 : 72,
      rotateX: type.includes('chars') ? -88 : 0,
      skewX: type.includes('chars') ? -6 : 0,
      stagger: type.includes('chars') ? 0.012 : 0.06,
      duration: type.includes('chars') ? 0.95 : 1.05,
      delay: delay,
      ease: 'expo.out'
    }, 0)
    
    // Refresh ScrollTrigger after splitting and initial animation set to avoid sync issues
    if (scroll) {
      ScrollTrigger.refresh()
    }

  }, { scope: textRef, dependencies: [isSplit, ready, delay, scroll, type] })

  return (
    <div 
      ref={textRef} 
      className={className} 
      style={{ 
        position: 'relative', 
        opacity: 0,
        perspective: type.includes('chars') ? '900px' : undefined,
        transformStyle: type.includes('chars') ? 'preserve-3d' : undefined
      }}
    >
      {children}
    </div>
  )
}
