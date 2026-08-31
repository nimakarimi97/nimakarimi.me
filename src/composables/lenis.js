import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

/**
 * @type {Lenis | null}
 */
let _lenis = null

/**
 * @type {((time: number) => void) | null}
 */
let _tickerCallback = null

export function useLenis() {
  /**
   * Initializes global Lenis smooth scrolling and binds with GSAP ticker & ScrollTrigger.
   * @param {object} [customOptions]
   * @returns {Lenis} The initialized Lenis instance
   */
  const initLenis = (customOptions = {}) => {
    if (_lenis) {
      return _lenis
    }

    const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    _lenis = new Lenis({
      duration: 1.3,
      easing: t => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !reducedMotion,
      wheelMultiplier: 0.85,
      touchMultiplier: isTouch ? 1.0 : 1.2,
      ...customOptions,
    })

    // Synchronize Lenis scroll updates with GSAP ScrollTrigger
    _lenis.on('scroll', ScrollTrigger.update)

    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('lenis', 'lenis-smooth')
    }

    if (typeof window !== 'undefined') {
      window.__lenis = _lenis
    }

    // Hook Lenis into GSAP requestAnimationFrame ticker
    _tickerCallback = (time) => {
      if (_lenis) {
        _lenis.raf(time * 1000)
      }
    }
    gsap.ticker.add(_tickerCallback)
    gsap.ticker.lagSmoothing(0)

    return _lenis
  }

  /**
   * Returns current Lenis instance.
   * @returns {Lenis | null} The active Lenis instance or null
   */
  const getLenis = () => _lenis

  /**
   * Smoothly scrolls to a target element or position.
   * @param {string | HTMLElement | number} target
   * @param {object} [options]
   */
  const scrollTo = (target, options = {}) => {
    if (!_lenis) {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: options.immediate ? 'instant' : 'smooth' })
      } else if (typeof target === 'string') {
        const el = target.startsWith('#') || target.startsWith('.') ? document.querySelector(target) : document.getElementById(target)
        if (el) {
          el.scrollIntoView({ behavior: options.immediate ? 'instant' : 'smooth' })
        }
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: options.immediate ? 'instant' : 'smooth' })
      }
      return
    }

    if (_lenis.isStopped) {
      _lenis.start()
    }

    _lenis.scrollTo(target, {
      offset: 0,
      duration: 1.3,
      easing: t => Math.min(1, 1.001 - 2 ** (-10 * t)),
      ...options,
    })
  }

  /**
   * Stops Lenis smooth scrolling (e.g. for modal overlays).
   */
  const stop = () => {
    if (_lenis) {
      _lenis.stop()
    }
  }

  /**
   * Resumes Lenis smooth scrolling.
   */
  const start = () => {
    if (_lenis) {
      _lenis.start()
    }
  }

  /**
   * Destroys current Lenis instance and unbinds ticker.
   */
  const destroy = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
    }
    if (typeof window !== 'undefined') {
      delete window.__lenis
    }
    if (_tickerCallback) {
      gsap.ticker.remove(_tickerCallback)
      _tickerCallback = null
    }
    if (_lenis) {
      _lenis.destroy()
      _lenis = null
    }
  }

  return {
    initLenis,
    getLenis,
    scrollTo,
    stop,
    start,
    destroy,
  }
}
