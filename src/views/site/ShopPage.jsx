'use client'

import { useEffect, useId, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { magnetic, magneticReset } from './motion-fx'
import { useSiteUI } from './site-ui.js'
import { SHOP_PRODUCTS } from './shopData.js'

const CELLS = 25

export function ShopPage() {
  const { t } = useLanguage()
  const { setOverlayLock } = useSiteUI()
  const [slot, setSlot] = useState(null)
  const [sheet, setSheet] = useState(null)
  const titleId = useId()

  useLayoutEffect(() => {
    setSlot(document.getElementById('hb-header-end'))
  }, [])

  useEffect(() => {
    setOverlayLock(sheet !== null)
    return () => setOverlayLock(false)
  }, [sheet, setOverlayLock])

  useEffect(() => {
    if (!sheet) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setSheet(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sheet])

  const product = sheet?.type === 'product' ? SHOP_PRODUCTS.find((item) => item.id === sheet.id) : null

  return (
    <article className="hb-page hb-shop">
      {slot
        ? createPortal(
            <button
              type="button"
              className="hb-mail"
              aria-expanded={sheet?.type === 'cart'}
              onClick={() => setSheet((current) => (current?.type === 'cart' ? null : { type: 'cart' }))}
              onPointerMove={magnetic}
              onPointerLeave={magneticReset}
            >
              {String(t('shop.cart'))}
            </button>,
            slot,
          )
        : null}

      <header className="hb-shop-intro">
        <h1>{String(t('shop.welcome'))}</h1>
        <p>{String(t('shop.tagline'))}</p>
      </header>

      <ul className="hb-shop-grid">
        {SHOP_PRODUCTS.map((item) => {
          const view = pieceView(item, t)
          return (
            <li key={item.id}>
              <button
                type="button"
                className="hb-shop-card"
                onClick={() => setSheet({ type: 'product', id: item.id })}
              >
                <span className="hb-shop-name">
                  <span>{view.title}</span>
                  {view.price ? <span>{view.price}</span> : null}
                </span>
                <span className="hb-shop-label">\ {view.label} \</span>
                <Parcel tilt={item.tilt} tape={item.tape} />
              </button>
            </li>
          )
        })}
      </ul>

      <div className="hb-shop-veil" aria-hidden />
      <p className="hb-shop-sign" role="status">
        {String(t('shop.wip'))}
      </p>

      {sheet ? (
        <div className="hb-shop-sheet" role="dialog" aria-modal="true" aria-labelledby={titleId} data-lenis-prevent>
          <div className="hb-shop-sheet-bar">
            <button type="button" className="hb-menu-x" onClick={() => setSheet(null)} aria-label={String(t('shop.close'))}>
              <span />
              <span />
            </button>
          </div>
          {sheet.type === 'cart' || !product ? (
            <div className="hb-shop-sheet-copy">
              <h2 id={titleId}>{String(t('shop.cartTitle'))}</h2>
              <p>{String(t('shop.cartEmpty'))}</p>
            </div>
          ) : (
            <ProductSheet id={titleId} product={product} t={t} />
          )}
        </div>
      ) : null}
    </article>
  )
}

function ProductSheet({ id, product, t }) {
  const view = pieceView(product, t)
  return (
    <div className="hb-shop-sheet-grid">
      <div className="hb-shop-sheet-copy">
        <h2 id={id}>{view.title}</h2>
        <p className="hb-shop-kicker">\ {view.label} \</p>
        <p>{view.note}</p>
        {product.status !== 'ready' ? <p className="hb-shop-hold">{String(t('shop.unavailable'))}</p> : null}
      </div>
      <Parcel tilt={product.tilt} tape={product.tape} />
    </div>
  )
}

function Parcel({ tilt = 0, tape = 22 }) {
  return (
    <span className="hb-shop-parcel" style={{ '--tilt': `${tilt}deg`, '--tape': tape }} aria-hidden>
      <span className="hb-shop-tape" />
      <span className="hb-shop-tape hb-shop-tape--b" />
      <span className="hb-px-grid">
        {Array.from({ length: CELLS }, (_, index) => (
          <span key={index} className="hb-px" style={{ '--d': `${(index * 37) % 90}ms` }} />
        ))}
      </span>
    </span>
  )
}

function pieceView(product, t) {
  if (product.status === 'ready' && product.name) {
    return {
      title: product.name,
      price: product.price || '—',
      label: product.label || '',
      note: product.note || '',
    }
  }
  return {
    title: product.id,
    price: '',
    label: String(t('shop.packing')),
    note: String(t('shop.note')),
  }
}
