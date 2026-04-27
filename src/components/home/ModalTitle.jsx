export function ModalTitle({ text }) {
  const safeText = String(text || '')
  const shouldScroll = safeText.length > 32
  if (!shouldScroll) {
    return <>{safeText}</>
  }
  return (
    <span className="modal-title-ticker" aria-label={safeText}>
      <span className="modal-title-ticker-track">
        <span>{safeText}</span>
        <span aria-hidden>{safeText}</span>
      </span>
    </span>
  )
}
