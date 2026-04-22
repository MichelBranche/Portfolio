import { useEffect, useRef } from 'react'

const MONEY_SRCS = [
  '/images/money/50.png',
  '/images/money/100.png',
  '/images/money/200.png',
  '/images/money/500.png',
]
const NUM_BILLS = 28

function range(a, b) {
  return (b - a) * Math.random() + a
}

class Bill {
  constructor(images, getSize, getXpos) {
    this.images = images
    this.getSize = getSize
    this.getXpos = getXpos
    this.img = images[~~range(0, images.length)]
    this.width = range(70, 130)
    this.ratio = this.img.naturalHeight / this.img.naturalWidth || 0.5
    this.height = this.width * this.ratio
    this.replace(true)
  }

  replace(initial = false) {
    const { w, h } = this.getSize()
    this.opacity = 0
    this.dop = 0.02 * range(1, 3)
    this.x = range(-this.width, w)
    this.y = initial ? range(-h, -this.height) : range(-h * 0.5, -this.height)
    this.xmax = w
    this.ymax = h + this.height
    this.vx = range(-0.6, 0.6) + 3 * (this.getXpos() - 0.5)
    this.vy = range(1.4, 3.2)
    this.angle = range(0, Math.PI * 2)
    this.va = range(-0.04, 0.04)
  }

  draw(ctx) {
    this.x += this.vx
    this.y += this.vy
    this.angle += this.va
    this.opacity += this.dop
    if (this.opacity > 1) {
      this.opacity = 1
      this.dop = 0
    }
    if (this.y > this.ymax) {
      this.replace()
    }

    ctx.save()
    ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity))
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2)
    ctx.rotate(this.angle)
    // Slight flutter along horizontal axis via scaleX
    const flutter = Math.cos(this.angle * 2) * 0.35 + 0.65
    ctx.scale(flutter, 1)
    ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height)
    ctx.restore()
  }
}

export default function MoneyRain({ active }) {
  const canvasRef = useRef(null)
  const sizeRef = useRef({ w: 0, h: 0 })
  const xposRef = useRef(0.5)
  const rafRef = useRef(null)
  const billsRef = useRef([])
  const imagesRef = useRef([])
  const readyRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      sizeRef.current.w = canvas.width = window.innerWidth
      sizeRef.current.h = canvas.height = window.innerHeight
    }
    resize()

    const getSize = () => sizeRef.current
    const getXpos = () => xposRef.current

    const loadImages = () =>
      Promise.all(
        MONEY_SRCS.map(
          (src) =>
            new Promise((resolve) => {
              const img = new Image()
              img.onload = () => resolve(img)
              img.onerror = () => resolve(null)
              img.src = src
            }),
        ),
      )

    let cancelled = false
    loadImages().then((imgs) => {
      if (cancelled) return
      imagesRef.current = imgs.filter(Boolean)
      if (imagesRef.current.length === 0) return
      billsRef.current = Array.from(
        { length: NUM_BILLS },
        () => new Bill(imagesRef.current, getSize, getXpos),
      )
      readyRef.current = true
    })

    const onMouseMove = (e) => {
      const { w } = sizeRef.current
      if (w > 0) xposRef.current = e.pageX / w
    }
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelled = true
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    if (!active) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    const start = () => {
      if (!readyRef.current) {
        rafRef.current = requestAnimationFrame(start)
        return
      }
      billsRef.current.forEach((b) => b.replace(true))
      const step = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (const b of billsRef.current) b.draw(ctx)
        rafRef.current = requestAnimationFrame(step)
      }
      step()
    }
    start()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      className={`money-canvas${active ? ' money-canvas--active' : ''}`}
      aria-hidden="true"
    />
  )
}
