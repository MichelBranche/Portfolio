/** Class names condizionali (Twind-style) senza dipendenze. */
export function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}
