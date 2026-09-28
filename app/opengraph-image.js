import { ImageResponse } from 'next/og'

export const alt = 'Michel Branche, web developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#f47856',
          color: '#111111',
          padding: '72px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, letterSpacing: 4 }}>MICHEL BRANCHE</div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 76, fontWeight: 800, lineHeight: 0.95, letterSpacing: -2 }}>
          <span>Siti per hotel,</span>
          <span>B&B e attività locali.</span>
        </div>
        <div style={{ display: 'flex', fontSize: 28, fontWeight: 700 }}>michelbranche.it</div>
      </div>
    ),
    { ...size },
  )
}
