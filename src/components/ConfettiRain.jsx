import { useEffect, useRef } from 'react'

const SPEED = 50
const DURATION = 1.0 / SPEED
const RIBBON_COUNT = 11
const RIBBON_PARTICLE_COUNT = 30
const RIBBON_PAPER_DIST = 8.0
const RIBBON_PAPER_THICK = 8.0
const PAPER_COUNT = 95
const DEG_TO_RAD = Math.PI / 180

const COLORS = [
  ['#df0049', '#660671'],
  ['#00e857', '#005291'],
  ['#2bebbc', '#05798a'],
  ['#ffd200', '#b06c00'],
]

const { cos, sin, sqrt, random, round, PI } = Math

function Vector2(x, y) {
  this.x = x
  this.y = y
}
Vector2.prototype.Length = function () {
  return sqrt(this.SqrLength())
}
Vector2.prototype.SqrLength = function () {
  return this.x * this.x + this.y * this.y
}
Vector2.prototype.Add = function (v) {
  this.x += v.x
  this.y += v.y
}
Vector2.prototype.Sub = function (v) {
  this.x -= v.x
  this.y -= v.y
}
Vector2.prototype.Div = function (f) {
  this.x /= f
  this.y /= f
}
Vector2.prototype.Mul = function (f) {
  this.x *= f
  this.y *= f
}
Vector2.prototype.Normalize = function () {
  const sqrLen = this.SqrLength()
  if (sqrLen !== 0) {
    const factor = 1.0 / sqrt(sqrLen)
    this.x *= factor
    this.y *= factor
  }
}
Vector2.Sub = function (a, b) {
  return new Vector2(a.x - b.x, a.y - b.y)
}

function EulerMass(x, y, mass, drag) {
  this.position = new Vector2(x, y)
  this.mass = mass
  this.drag = drag
  this.force = new Vector2(0, 0)
  this.velocity = new Vector2(0, 0)
}
EulerMass.prototype.AddForce = function (f) {
  this.force.Add(f)
}
EulerMass.prototype.CurrentForce = function () {
  const totalForce = new Vector2(this.force.x, this.force.y)
  const speed = this.velocity.Length()
  const dragVel = new Vector2(this.velocity.x, this.velocity.y)
  dragVel.Mul(this.drag * this.mass * speed)
  totalForce.Sub(dragVel)
  return totalForce
}
EulerMass.prototype.Integrate = function (dt) {
  const acc = this.CurrentForce()
  acc.Div(this.mass)
  const posDelta = new Vector2(this.velocity.x, this.velocity.y)
  posDelta.Mul(dt)
  this.position.Add(posDelta)
  acc.Mul(dt)
  this.velocity.Add(acc)
  this.force = new Vector2(0, 0)
}

function ConfettiPaper(x, y, bounds) {
  this.pos = new Vector2(x, y)
  this.bounds = bounds
  this.rotationSpeed = random() * 600 + 800
  this.angle = DEG_TO_RAD * random() * 360
  this.rotation = DEG_TO_RAD * random() * 360
  this.cosA = 1.0
  this.size = 5.0
  this.oscillationSpeed = random() * 1.5 + 0.5
  this.xSpeed = 40.0
  this.ySpeed = random() * 60 + 50.0
  this.corners = []
  this.time = random()
  const ci = round(random() * (COLORS.length - 1))
  this.frontColor = COLORS[ci][0]
  this.backColor = COLORS[ci][1]
  for (let i = 0; i < 4; i++) {
    const dx = cos(this.angle + DEG_TO_RAD * (i * 90 + 45))
    const dy = sin(this.angle + DEG_TO_RAD * (i * 90 + 45))
    this.corners[i] = new Vector2(dx, dy)
  }
}
ConfettiPaper.prototype.Update = function (dt) {
  this.time += dt
  this.rotation += this.rotationSpeed * dt
  this.cosA = cos(DEG_TO_RAD * this.rotation)
  this.pos.x += cos(this.time * this.oscillationSpeed) * this.xSpeed * dt
  this.pos.y += this.ySpeed * dt
  if (this.pos.y > this.bounds.y) {
    this.pos.x = random() * this.bounds.x
    this.pos.y = 0
  }
}
ConfettiPaper.prototype.Draw = function (g, retina) {
  g.fillStyle = this.cosA > 0 ? this.frontColor : this.backColor
  g.beginPath()
  g.moveTo(
    (this.pos.x + this.corners[0].x * this.size) * retina,
    (this.pos.y + this.corners[0].y * this.size * this.cosA) * retina,
  )
  for (let i = 1; i < 4; i++) {
    g.lineTo(
      (this.pos.x + this.corners[i].x * this.size) * retina,
      (this.pos.y + this.corners[i].y * this.size * this.cosA) * retina,
    )
  }
  g.closePath()
  g.fill()
}

function ConfettiRibbon(x, y, count, dist, thickness, angle, mass, drag, bounds) {
  this.particleDist = dist
  this.particleCount = count
  this.particleMass = mass
  this.particleDrag = drag
  this.particles = []
  this.bounds = bounds
  const ci = round(random() * (COLORS.length - 1))
  this.frontColor = COLORS[ci][0]
  this.backColor = COLORS[ci][1]
  this.xOff = cos(DEG_TO_RAD * angle) * thickness
  this.yOff = sin(DEG_TO_RAD * angle) * thickness
  this.position = new Vector2(x, y)
  this.prevPosition = new Vector2(x, y)
  this.velocityInherit = random() * 2 + 4
  this.time = random() * 100
  this.oscillationSpeed = random() * 2 + 2
  this.oscillationDistance = random() * 40 + 40
  this.ySpeed = random() * 40 + 80
  for (let i = 0; i < this.particleCount; i++) {
    this.particles[i] = new EulerMass(x, y - i * this.particleDist, this.particleMass, this.particleDrag)
  }
}
ConfettiRibbon.prototype.Update = function (dt) {
  this.time += dt * this.oscillationSpeed
  this.position.y += this.ySpeed * dt
  this.position.x += cos(this.time) * this.oscillationDistance * dt
  this.particles[0].position = this.position
  const dX = this.prevPosition.x - this.position.x
  const dY = this.prevPosition.y - this.position.y
  const delta = sqrt(dX * dX + dY * dY)
  this.prevPosition = new Vector2(this.position.x, this.position.y)
  for (let i = 1; i < this.particleCount; i++) {
    const dirP = Vector2.Sub(this.particles[i - 1].position, this.particles[i].position)
    dirP.Normalize()
    dirP.Mul((delta / dt) * this.velocityInherit)
    this.particles[i].AddForce(dirP)
  }
  for (let i = 1; i < this.particleCount; i++) {
    this.particles[i].Integrate(dt)
  }
  for (let i = 1; i < this.particleCount; i++) {
    const rp2 = new Vector2(this.particles[i].position.x, this.particles[i].position.y)
    rp2.Sub(this.particles[i - 1].position)
    rp2.Normalize()
    rp2.Mul(this.particleDist)
    rp2.Add(this.particles[i - 1].position)
    this.particles[i].position = rp2
  }
  if (this.position.y > this.bounds.y + this.particleDist * this.particleCount) {
    this.Reset()
  }
}
ConfettiRibbon.prototype.Reset = function () {
  this.position.y = -random() * this.bounds.y
  this.position.x = random() * this.bounds.x
  this.prevPosition = new Vector2(this.position.x, this.position.y)
  this.velocityInherit = random() * 2 + 4
  this.time = random() * 100
  this.oscillationSpeed = random() * 2.0 + 1.5
  this.oscillationDistance = random() * 40 + 40
  this.ySpeed = random() * 40 + 80
  const ci = round(random() * (COLORS.length - 1))
  this.frontColor = COLORS[ci][0]
  this.backColor = COLORS[ci][1]
  this.particles = []
  for (let i = 0; i < this.particleCount; i++) {
    this.particles[i] = new EulerMass(
      this.position.x,
      this.position.y - i * this.particleDist,
      this.particleMass,
      this.particleDrag,
    )
  }
}
ConfettiRibbon.prototype.Side = function (x1, y1, x2, y2, x3, y3) {
  return (x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2)
}
ConfettiRibbon.prototype.Draw = function (g, retina) {
  for (let i = 0; i < this.particleCount - 1; i++) {
    const p0 = new Vector2(
      this.particles[i].position.x + this.xOff,
      this.particles[i].position.y + this.yOff,
    )
    const p1 = new Vector2(
      this.particles[i + 1].position.x + this.xOff,
      this.particles[i + 1].position.y + this.yOff,
    )
    if (
      this.Side(
        this.particles[i].position.x,
        this.particles[i].position.y,
        this.particles[i + 1].position.x,
        this.particles[i + 1].position.y,
        p1.x,
        p1.y,
      ) < 0
    ) {
      g.fillStyle = this.frontColor
      g.strokeStyle = this.frontColor
    } else {
      g.fillStyle = this.backColor
      g.strokeStyle = this.backColor
    }
    if (i === 0) {
      g.beginPath()
      g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina)
      g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina)
      g.lineTo(
        ((this.particles[i + 1].position.x + p1.x) * 0.5) * retina,
        ((this.particles[i + 1].position.y + p1.y) * 0.5) * retina,
      )
      g.closePath()
      g.stroke()
      g.fill()
      g.beginPath()
      g.moveTo(p1.x * retina, p1.y * retina)
      g.lineTo(p0.x * retina, p0.y * retina)
      g.lineTo(
        ((this.particles[i + 1].position.x + p1.x) * 0.5) * retina,
        ((this.particles[i + 1].position.y + p1.y) * 0.5) * retina,
      )
      g.closePath()
      g.stroke()
      g.fill()
    } else if (i === this.particleCount - 2) {
      g.beginPath()
      g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina)
      g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina)
      g.lineTo(
        ((this.particles[i].position.x + p0.x) * 0.5) * retina,
        ((this.particles[i].position.y + p0.y) * 0.5) * retina,
      )
      g.closePath()
      g.stroke()
      g.fill()
      g.beginPath()
      g.moveTo(p1.x * retina, p1.y * retina)
      g.lineTo(p0.x * retina, p0.y * retina)
      g.lineTo(
        ((this.particles[i].position.x + p0.x) * 0.5) * retina,
        ((this.particles[i].position.y + p0.y) * 0.5) * retina,
      )
      g.closePath()
      g.stroke()
      g.fill()
    } else {
      g.beginPath()
      g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina)
      g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina)
      g.lineTo(p1.x * retina, p1.y * retina)
      g.lineTo(p0.x * retina, p0.y * retina)
      g.closePath()
      g.stroke()
      g.fill()
    }
  }
}

export default function ConfettiRain({ active }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const stateRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const retina = window.devicePixelRatio || 1
    const ctx =
      canvas.getContext('2d', { alpha: true, desynchronized: true }) || canvas.getContext('2d')

    let canvasWidth = window.innerWidth
    let canvasHeight = window.innerHeight
    canvas.width = canvasWidth * retina
    canvas.height = canvasHeight * retina

    const bounds = new Vector2(canvasWidth, canvasHeight)
    const papers = []
    for (let i = 0; i < PAPER_COUNT; i++) {
      papers.push(new ConfettiPaper(random() * canvasWidth, random() * canvasHeight, bounds))
    }
    const ribbons = []
    for (let i = 0; i < RIBBON_COUNT; i++) {
      ribbons.push(
        new ConfettiRibbon(
          random() * canvasWidth,
          -random() * canvasHeight * 2,
          RIBBON_PARTICLE_COUNT,
          RIBBON_PAPER_DIST,
          RIBBON_PAPER_THICK,
          45,
          1,
          0.05,
          bounds,
        ),
      )
    }

    stateRef.current = { ctx, canvas, retina, bounds, papers, ribbons }

    const resize = () => {
      canvasWidth = window.innerWidth
      canvasHeight = window.innerHeight
      canvas.width = canvasWidth * retina
      canvas.height = canvasHeight * retina
      bounds.x = canvasWidth
      bounds.y = canvasHeight
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
    const { ctx, canvas, retina, papers, ribbons } = state

    if (!active) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < papers.length; i++) {
        papers[i].Update(DURATION)
        papers[i].Draw(ctx, retina)
      }
      for (let i = 0; i < ribbons.length; i++) {
        ribbons[i].Update(DURATION)
        ribbons[i].Draw(ctx, retina)
      }
      rafRef.current = requestAnimationFrame(step)
    }
    step()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      className={`confetti-canvas${active ? ' confetti-canvas--active' : ''}`}
      aria-hidden="true"
    />
  )
}
