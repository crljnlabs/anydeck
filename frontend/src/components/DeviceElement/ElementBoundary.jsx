import { Component } from 'react'

/**
 * Keeps a broken element from taking the whole window with it.
 *
 * This is not defensive decoration. A model that fails to load throws while
 * React is rendering, and an unhandled throw there unmounts the entire tree -
 * the app goes blank, with nothing on screen to say why. That happened for
 * real: a packaged build served HTML in place of every .glb, and the result was
 * an empty window rather than eleven missing elements.
 *
 * A device is a collection of independent parts, and one part failing should
 * cost that part and nothing else.
 */
export class ElementBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    // The window has no developer console, so this is the only place the reason
    // is ever written down.
    console.error('element failed to render', error)
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}

export default ElementBoundary
