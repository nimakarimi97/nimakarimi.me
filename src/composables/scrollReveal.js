/**
 * Composable that provides an IntersectionObserver-based reveal helper.
 * When an observed element enters the viewport it receives the `is-revealed` class.
 */
export function useScrollReveal() {
  /**
   * @param {Element[]} elements
   * @param {{ threshold?: number, once?: boolean, root?: Element|null, rootMargin?: string, onReveal?: (element: Element, entry: IntersectionObserverEntry) => void }} [options]
   * @returns {() => void} Teardown function that disconnects the observer.
   */
  function observe(elements, options = {}) {
    const {
      threshold = 0.1,
      once = true,
      root = null,
      rootMargin = '0px',
      onReveal = null,
    } = options

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            if (typeof onReveal === 'function') {
              onReveal(entry.target, entry)
            }
            if (once)
              observer.unobserve(entry.target)
          }
        })
      },
      { threshold, root, rootMargin },
    )

    elements.forEach(el => el && observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }

  return { observe }
}
