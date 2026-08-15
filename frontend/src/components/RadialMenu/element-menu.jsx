import { BoltIcon, PencilIcon, TrashIcon } from './menu-icons'

/**
 * The entries shown around an element in the device editor.
 *
 * Deliberately a plain array: adding an entry is one object, and the ring
 * lays out however many it is given without any further change. Consumers get
 * the `id` back from `onSelect` and decide what it does, so this file stays
 * free of application logic.
 *
 * `tone: 'danger'` is the only styling hook so far; extend
 * `radial-menu.css` if a new entry needs another.
 */
export const ELEMENT_MENU_ITEMS = [
  {
    id: 'action',
    label: 'Action',
    icon: <BoltIcon />,
  },
  {
    id: 'rename',
    label: 'Rename',
    icon: <PencilIcon />,
  },
  {
    id: 'remove',
    label: 'Remove',
    icon: <TrashIcon />,
    tone: 'danger',
  },
]
