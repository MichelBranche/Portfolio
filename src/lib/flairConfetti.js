import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import Physics2DPlugin from 'gsap/Physics2DPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, Observer, Physics2DPlugin)

class ConfettiCannon {
  constructor(hero) {
    this.hero = hero
    this.el = {
      canvas: hero.querySelector('.pricing-hero__canvas'),
      proxy: hero.querySelector('.pricing-hero__proxy'),
      preloadImages: hero.querySelectorAll('.image-preload img'),
      xplodePreloadImages: hero.querySelectorAll('.explosion-preload img'),
    }
    this.isDrawing = false
    this.imageMap = {}
    this.imageKeys = []
    this.explosionMap = {}
    this.explosionKeys = []
    this.currentLine = null
    this.startImage = null
    this.circle = null
    this.startX = 0
    this.startY = 0
    this.lastDistance = 0
    this.observers = []
    this.animationIsOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    this.clamper = gsap.utils.clamp(1, 100)
  }

  init() {
    const { canvas, proxy, preloadImages, xplodePreloadImages } = this.el
    if (!canvas || !proxy) {
      return
    }

    preloadImages.forEach((img) => {
      const { key } = img.dataset
      this.imageMap[key] = img
      this.imageKeys.push(key)
    })
    xplodePreloadImages.forEach((img) => {
      const { key } = img.dataset
      this.explosionMap[key] = img
      this.explosionKeys.push(key)
    })

    this.initObserver()
  }

  localFromEvent(e) {
    const r = this.el.canvas.getBoundingClientRect()
    const x = (e.clientX ?? e.x) - r.left
    const y = (e.clientY ?? e.y) - r.top
    return { x, y, r }
  }

  startDrawing(e) {
    this.isDrawing = true
    const { x, y } = this.localFromEvent(e)
    this.startX = x
    this.startY = y

    this.currentLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    this.currentLine.setAttribute('x1', String(this.startX))
    this.currentLine.setAttribute('y1', String(this.startY))
    this.currentLine.setAttribute('x2', String(this.startX))
    this.currentLine.setAttribute('y2', String(this.startY))
    this.currentLine.setAttribute('stroke', '#fffce1')
    this.currentLine.setAttribute('stroke-width', '2')
    this.currentLine.setAttribute('stroke-dasharray', '4')

    this.circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.circle.setAttribute('cx', String(this.startX))
    this.circle.setAttribute('cy', String(this.startY))
    this.circle.setAttribute('r', '30')
    this.circle.setAttribute('fill', '#0e100f')

    const randomKey = gsap.utils.random(this.imageKeys)
    const original = this.imageMap[randomKey]
    const clone = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    clone.setAttribute('x', String(this.startX - 25))
    clone.setAttribute('y', String(this.startY - 25))
    clone.setAttribute('width', '50')
    clone.setAttribute('height', '50')
    clone.setAttributeNS('http://www.w3.org/1999/xlink', 'href', original.src)
    this.startImage = clone

    this.el.canvas.appendChild(this.currentLine)
    this.el.canvas.appendChild(this.circle)
    this.el.canvas.appendChild(this.startImage)
  }

  updateDrawing(e) {
    if (!this.currentLine || !this.startImage) {
      return
    }
    const { x: cursorX, y: cursorY } = this.localFromEvent(e)
    const dx = cursorX - this.startX
    const dy = cursorY - this.startY
    let distance = Math.sqrt(dx * dx + dy * dy)
    if (Number.isNaN(distance)) {
      return
    }
    const shrink = distance > 0.001 ? (distance - 30) / distance : 0
    let x2 = this.startX + dx * shrink
    let y2 = this.startY + dy * shrink
    if (distance < 30) {
      x2 = this.startX
      y2 = this.startY
    }
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI
    gsap.to(this.currentLine, { attr: { x2, y2 }, duration: 0.1, ease: 'none' })
    const raw = distance / 100
    const eased = Math.pow(Math.max(0, raw), 0.5)
    const clamped = this.clamper(eased)
    gsap.set([this.startImage, this.circle], {
      scale: clamped,
      rotation: `${angle - 45}_short`,
      transformOrigin: 'center center',
    })
    this.lastDistance = distance
  }

  createExplosion(x, y, distance = 100) {
    if (!this.explosionKeys.length) {
      return gsap.timeline()
    }
    const count = Math.round(gsap.utils.clamp(3, 100, distance / 20))
    const angleSpread = Math.PI * 2
    const explosion = gsap.timeline()
    const speed = gsap.utils.mapRange(0, 500, 0.3, 1.5, distance)
    const sizeRange = gsap.utils.mapRange(0, 500, 20, 60, distance)

    for (let i = 0; i < count; i += 1) {
      const randomKey = gsap.utils.random(this.explosionKeys)
      const original = this.explosionMap[randomKey]
      if (!original) {
        break
      }
      const img = original.cloneNode(true)
      img.className = 'explosion-img'
      img.style.position = 'absolute'
      img.style.pointerEvents = 'none'
      img.style.height = `${gsap.utils.random(20, sizeRange)}px`
      img.style.left = `${x}px`
      img.style.top = `${y}px`
      img.style.zIndex = '4'
      this.hero.appendChild(img)

      const ang = Math.random() * angleSpread
      const velocity = gsap.utils.random(500, 1500) * speed
      explosion
        .to(
          img,
          {
            physics2D: { angle: ang * (180 / Math.PI), velocity, gravity: 3000 },
            rotation: gsap.utils.random(-180, 180),
            duration: 1 + Math.random(),
          },
          0,
        )
        .to(
          img,
          {
            opacity: 0,
            duration: 0.2,
            ease: 'power1.out',
            onComplete: () => img.remove(),
          },
          1,
        )
    }
    return explosion
  }

  clearDrawing() {
    if (!this.isDrawing) {
      return
    }
    const d = Math.max(30, this.lastDistance, 1)
    this.createExplosion(this.startX, this.startY, d)
    this.isDrawing = false
    this.el.canvas.innerHTML = ''
    this.currentLine = null
    this.startImage = null
    this.circle = null
  }

  initObserver() {
    if (!this.animationIsOk) {
      return
    }

    if (ScrollTrigger.isTouch === 1) {
      const o = Observer.create({
        target: this.el.proxy,
        type: 'touch',
        onPress: (e) => {
          const br = this.hero.getBoundingClientRect()
          this.createExplosion(
            (e.clientX ?? e.x) - br.left,
            (e.clientY ?? e.y) - br.top,
            400,
          )
        },
      })
      this.observers.push(o)
    } else {
      const o = Observer.create({
        target: this.el.proxy,
        type: 'pointer',
        onPress: (e) => this.startDrawing(e),
        onDrag: (e) => this.isDrawing && this.updateDrawing(e),
        onDragEnd: () => this.clearDrawing(),
        onRelease: () => this.clearDrawing(),
      })
      this.observers.push(o)
    }
  }

  destroy() {
    this.observers.forEach((o) => o.kill())
    this.observers = []
    if (this.el?.canvas) {
      this.el.canvas.innerHTML = ''
    }
    this.hero?.querySelectorAll('.explosion-img').forEach((n) => n.remove())
  }
}

export function initFlairConfetti(heroElement) {
  if (!heroElement || typeof window === 'undefined') {
    return () => {}
  }
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    return () => {}
  }
  const cannon = new ConfettiCannon(heroElement)
  cannon.init()
  return () => {
    try {
      cannon.destroy()
    } catch {
      // ignore
    }
  }
}
