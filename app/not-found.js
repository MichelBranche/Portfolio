import Link from 'next/link'

export const metadata = {
  title: { absolute: '404 | Michel Branche' },
  description: 'Questa pagina non c’è.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="hb-404">
      <p className="hb-label">MICHEL BRANCHE</p>
      <h1>404</h1>
      <p>Questa pagina non c’è.</p>
      <p>This page isn’t here.</p>
      <Link href="/">Home</Link>
    </main>
  )
}
