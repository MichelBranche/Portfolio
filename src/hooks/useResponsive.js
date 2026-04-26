import { useMediaQuery } from 'react-responsive'

/** Coerente con `App.css` @media (max-width: 900px) (layout “mobile” sezione) */
export const MOBILE_MAX_PX = 900
/** Soglia parallax / drone (come in VisualSection) */
export const DRONE_TABLET_MIN_PX = 768

/** Larghezza ≤ 900px — stessa convenzione del CSS principale. */
export function useIsMobileLayout() {
  return useMediaQuery({ maxWidth: MOBILE_MAX_PX })
}

/**
 * Larghezza &gt; 900px — statement pin + timeline “desktop” in VisualSection.
 */
export function useIsVisualStatementDesktop() {
  return useMediaQuery({ minWidth: MOBILE_MAX_PX + 1 })
}

/**
 * Larghezza &gt; 768px — intensità parallax drone in VisualSection.
 */
export function useIsDroneLayoutDesktop() {
  return useMediaQuery({ minWidth: DRONE_TABLET_MIN_PX + 1 })
}

/** Dito / stilo: niente “hover reale” — allineato a `isCoarsePointerDevice` in App.jsx */
export function useIsCoarsePointerDevice() {
  return useMediaQuery({ query: '(hover: none) and (pointer: coarse)' })
}

/** Stessa media query usata in CSS/JS per animazioni e titolo documento */
export function usePrefersReducedMotion() {
  return useMediaQuery({ query: '(prefers-reduced-motion: reduce)' })
}
