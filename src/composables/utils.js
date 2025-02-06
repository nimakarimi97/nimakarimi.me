/* eslint-disable regexp/no-unused-capturing-group */
/**
 * Created by Nima Karimi on 08.23.2023
 * This composable will implement helper functions that can be used by multiple components within the architecture.
 */
export function useUtils() {
  /**
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  const clamp = (value, min, max) => {
    if (Number.isNaN(Number(value)) || value === null || value === undefined)
      return min

    return Math.min(Math.max(value, min), max)
  }

  /**
   * @Boolean
   */
  const isAndroid = () => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    return /android/.test(userAgent)
  }

  /**
   * @Boolean
   */
  const isIOS = () => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    return /iphone|ipad|ipod/.test(userAgent)
  }

  /**
   * @param {string} string
   * @return {boolean}
   */
  const isStringAnImageUrl = (string) => {
    return /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(string)
  }

  /**
   * @param {string} string
   * @return {boolean}
   */
  const isStringAJSONUrl = (string) => {
    return /\.(json)$/i.test(string)
  }

  /**
   * @return {boolean}
   */
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
  }

  /**
   * @param {string} stringDate
   * @param {string} languageId
   * @return {string}
   */
  const localizeDate = (stringDate, languageId) => {
    const date = stringDate === 'now' ? 'present' : parseDate(stringDate)
    const options = { year: 'numeric', month: 'short' }

    const localizedDate = date.toLocaleString(languageId || 'en', options)

    return localizedDate.charAt(0).toUpperCase() + localizedDate.slice(1)
  }

  /**
   * @param {string} stringDate
   */
  function parseDate(stringDate) {
    const parts = stringDate.split('/')
    if (parts.length === 2) {
      const year = Number.parseInt(parts[0], 10)
      const month = Number.parseInt(parts[1], 10) - 1
      if (!Number.isNaN(year) && !Number.isNaN(month)) {
        return new Date(year, month)
      }
    }

    return null
  }

  /**
   * @param {number} numericValue
   * @param {object} breakpoints
   * @return {string | number}
   */
  const parsePercentage = (numericValue, breakpoints) => {
    const percentage = clamp(numericValue, 0, 100)
    if (!breakpoints || typeof breakpoints !== 'object') {
      return `${percentage}%`
    }

    const breakpointsKeys = Object.keys(breakpoints)
    const breakpoint = breakpointsKeys.reduce((prev, curr) => {
      return Number(curr) <= percentage ? curr : prev
    }, '0')
    return breakpoints[breakpoint]
  }

  /**
   * @param {Array} array
   * @return {Array}
   */
  const reverseArray = (array) => {
    const reversed = []
    for (const i in array) {
      reversed.unshift(array[i])
    }
    return reversed
  }

  return {
    clamp,
    isStringAnImageUrl,
    isStringAJSONUrl,
    isAndroid,
    isIOS,
    isTouchDevice,
    localizeDate,
    parseDate,
    parsePercentage,
    reverseArray,
  }
}
