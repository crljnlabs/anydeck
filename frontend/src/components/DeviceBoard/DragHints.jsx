import { createPortal } from 'react-dom'

/**
 * What you can do with the element you are holding, shown while you hold it.
 *
 * At the bottom of the window rather than next to the element: it belongs to
 * the gesture, not to the thing being dragged, and following the element around
 * would put it under the pointer half the time.
 *
 * Only shortcuts that apply right now appear here. A list of everything the
 * board can do would be a manual, and a manual on screen during a drag is in
 * the way.
 */
export function DragHints({ hints }) {
  return createPortal(
    <div className="drag-hints" role="status">
      {hints.map((hint) => (
        <span key={hint.key}>
          <kbd>{hint.key}</kbd>
          {hint.label}
        </span>
      ))}
    </div>,
    document.body,
  )
}

export default DragHints
