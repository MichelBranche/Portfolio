import { useEffect, useRef } from 'react'

function rand(min, max) {
  return Math.random() * (max - min) + min
}

function calculateDistance(p1x, p1y, p2x, p2y) {
  const xDistance = p1x - p2x
  const yDistance = p1y - p2y
  return Math.sqrt(xDistance * xDistance + yDistance * yDistance)
}

class Firework {
  constructor(sx, sy, tx, ty, hueRef) {
    this.hueRef = hueRef
    this.x = sx
    this.y = sy
    this.sx = sx
    this.sy = sy
    this.tx = tx
    this.ty = ty
    this.distanceToTarget = calculateDistance(sx, sy, tx, ty)
    this.distanceTraveled = 0
    this.coordinates = []
    this.coordinateCount = 3
    for (let i = 0; i < this.coordinateCount; i++) {
      this.coordinates.push([this.x, this.y])
    }
    this.angle = Math.atan2(ty - sy, tx - sx)
    this.speed = 2
    this.acceleration = 1.05
    this.brightness = rand(50, 70)
    this.targetRadius = 1
    this.hue = hueRef.current
  }

  update(index, fireworks, createParticles) {
    this.coordinates.pop()
    this.coordinates.unshift([this.x, this.y])

    if (this.targetRadius < 8) {
      this.targetRadius += 0.3
    } else {
      this.targetRadius = 1
    }

    this.speed *= this.acceleration
    const vx = Math.cos(this.angle) * this.speed
    const vy = Math.sin(this.angle) * this.speed
    this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy)

    if (this.distanceTraveled >= this.distanceToTarget) {
      createParticles(this.tx, this.ty)
      fireworks.splice(index, 1)
    } else {
      this.x += vx
      this.y += vy
    }
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.moveTo(
      this.coordinates[this.coordinates.length - 1][0],
      this.coordinates[this.coordinates.length - 1][1],
    )
    ctx.lineTo(this.x, this.y)
    ctx.strokeStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2)
    ctx.stroke()
  }
}

class Particle {
  constructor(x, y, hueRef) {
    this.x = x
    this.y = y
    this.coordinates = []
    this.coordinateCount = 5
    for (let i = 0; i < this.coordinateCount; i++) {
      this.coordinates.push([this.x, this.y])
    }
    this.angle = rand(0, Math.PI * 2)
    this.speed = rand(1, 10)
    this.friction = 0.95
    this.gravity = 1
    this.hue = rand(hueRef.current - 20, hueRef.current + 20)
    this.brightness = rand(50, 80)
    this.alpha = 1
    this.decay = rand(0.015, 0.03)
  }

  update(index, particles) {
    this.coordinates.pop()
    this.coordinates.unshift([this.x, this.y])
    this.speed *= this.friction
    this.x += Math.cos(this.angle) * this.speed
    this.y += Math.sin(this.angle) * this.speed + this.gravity
    this.alpha -= this.decay

    if (this.alpha <= this.decay) {
      particles.splice(index, 1)
    }
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.moveTo(
      this.coordinates[this.coordinates.length - 1][0],
      this.coordinates[this.coordinates.length - 1][1],
    )
    ctx.lineTo(this.x, this.y)
    ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`
    ctx.stroke()
  }
}

export default function FireworksRain({ active }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const stateRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let cw = window.innerWidth
    let ch = window.innerHeight
    canvas.width = cw
    canvas.height = ch

    const state = {
      ctx,
      canvas,
      cw,
      ch,
      fireworks: [],
      particles: [],
      hueRef: { current: 120 },
      timerTick: 0,
      timerTotal: 40,
    }
    stateRef.current = state

    const resize = () => {
      cw = window.innerWidth
      ch = window.innerHeight
      canvas.width = cw
      canvas.height = ch
      state.cw = cw
      state.ch = ch
    }
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  useEffect(() => {
    const state = stateRef.current
    if (!state) return
    const { ctx, canvas } = state

    if (!active) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      state.fireworks = []
      state.particles = []
      state.timerTick = 0
      return
    }

    const createParticles = (x, y) => {
      let particleCount = 30
      while (particleCount--) {
        state.particles.push(new Particle(x, y, state.hueRef))
      }
    }

    state.fireworks.push(
      new Firework(
        state.cw / 2,
        state.ch,
        rand(0, state.cw),
        rand(0, state.ch / 2),
        state.hueRef,
      ),
    )

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop)

      state.hueRef.current += 0.5

      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(0, 0, state.cw, state.ch)
      ctx.globalCompositeOperation = 'lighter'

      let i = state.fireworks.length
      while (i--) {
        state.fireworks[i].draw(ctx)
        state.fireworks[i].update(i, state.fireworks, createParticles)
      }

      i = state.particles.length
      while (i--) {
        state.particles[i].draw(ctx)
        state.particles[i].update(i, state.particles)
      }

      if (state.timerTick >= state.timerTotal) {
        state.fireworks.push(
          new Firework(
            state.cw / 2,
            state.ch,
            rand(0, state.cw),
            rand(0, state.ch / 2),
            state.hueRef,
          ),
        )
        state.timerTick = 0
      } else {
        state.timerTick++
      }
    }
    loop()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      state.fireworks = []
      state.particles = []
    }
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      className={`fireworks-canvas${active ? ' fireworks-canvas--active' : ''}`}
      aria-hidden="true"
    />
  )
}
