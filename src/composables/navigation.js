/**
 * Created by Nima Karimi on 08.24.2023
 * This composable will be responsible for managing the navigation data.
 */

import { reactive } from 'vue'
import { useConstants } from './constants.js'
import { useLayout } from './layout.js'

const constants = useConstants()
const layout = useLayout()

/**
 * @enum
 */
const NavigationModes = {
  ONE_AT_ONCE: 'navigationModeOneAtOnce',
  ALL_AT_ONCE: 'navigationModeAllAtOnce',
}

/**
 * @constant
 * @type {string}
 */
const LOCAL_STORAGE_KEY = 'navigation.state'

/**
 * @type {any|{}}
 * @private
 */
const _savedState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {}

/**
 * @type {object}
 * @private
 */
const _navigationOptions = reactive({
  mode: NavigationModes.ALL_AT_ONCE,
  activeSectionId: null,
  lastVisitedSections: {},
  isSidebarExpanded: _savedState.isSidebarExpanded !== undefined ? _savedState.isSidebarExpanded : true,
})

/**
 * @type {{}}
 * @private
 */
const _categorySectionMapping = {}

export function useNavigation() {
  /**
   * @param {Array} sections
   * @param {Array} categories
   */
  function init(sections, categories) {
    categories.forEach((category) => {
      _categorySectionMapping[category.id] = []
    })

    sections.forEach((section) => {
      _categorySectionMapping[section.categoryId].push(section.id)
    })
  }

  /**
   * @return {boolean}
   */
  const isOneAtOnceMode = () => {
    return _navigationOptions.mode === NavigationModes.ONE_AT_ONCE
  }

  /**
   * @return {boolean}
   */
  const isAllAtOnceMode = () => {
    return _navigationOptions.mode === NavigationModes.ALL_AT_ONCE
  }

  /**
   * @return {string | null}
   */
  const getActiveSectionId = () => {
    return _navigationOptions.activeSectionId
  }

  /**
   * @param {string} sectionId
   * @return {boolean}
   */
  const isSectionActive = (sectionId) => {
    return _navigationOptions.activeSectionId === sectionId
  }

  /**
   * @param {string} sectionId
   * @return {boolean}
   */
  const isSectionVisible = (sectionId) => {
    return (
      _navigationOptions.activeSectionId === sectionId || _navigationOptions.mode === NavigationModes.ALL_AT_ONCE
    )
  }

  /**
   * @public
   * @return {boolean}
   */
  const isSidebarExpanded = () => {
    return _navigationOptions.isSidebarExpanded
  }

  /**
   * @public
   */
  const toggleSidebarStatus = () => {
    _navigationOptions.isSidebarExpanded = !_navigationOptions.isSidebarExpanded
    _saveState()
  }

  /**
   * @public
   * @param {boolean} expanded
   */
  const setSidebarStatus = (expanded) => {
    _navigationOptions.isSidebarExpanded = expanded
    _saveState()
  }

  /**
   * @return {string | null}
   */
  const getActiveCategoryId = () => {
    let activeCategoryId = null

    Object.entries(_categorySectionMapping).forEach(([categoryId, sectionArray]) => {
      if (sectionArray.includes(_navigationOptions.activeSectionId)) {
        activeCategoryId = categoryId
      }
    })

    return activeCategoryId
  }

  /**
   * @param {string} categoryId
   * @return {boolean}
   */
  const isCategoryActive = (categoryId) => {
    return categoryId === getActiveCategoryId()
  }

  /**
   * @private
   * @param {string} routeName
   */
  const update = (routeName) => {
    if (layout.isBootstrapBreakpoint(constants.NAVIGATION_SIDEBAR_BREAKPOINT)) {
      _navigationOptions.mode = NavigationModes.ALL_AT_ONCE
      _navigationOptions.activeSectionId = _scrollSpy('section')
    } else {
      _navigationOptions.mode = NavigationModes.ONE_AT_ONCE
      _navigationOptions.activeSectionId = routeName
    }
  }

  /**
   * @param {string} elementClass
   * @return {*|null}
   */
  function _scrollSpy(elementClass) {
    const sections = document.querySelectorAll(`.${elementClass}`)
    if (!sections)
      return null

    let currentSectionId = null
    let lowestYPosition = null

    sections.forEach((section) => {
      const divBounds = section.getBoundingClientRect()
      const distanceFromZero = Math.abs(divBounds.y)

      if (lowestYPosition === null || distanceFromZero < lowestYPosition) {
        lowestYPosition = distanceFromZero
        currentSectionId = section.id
      }
    })

    return currentSectionId
  }

  /**
   * @param {string} categoryId
   * @return {*}
   */
  const getLastVisitedSectionOn = (categoryId) => {
    if (_navigationOptions.lastVisitedSections[categoryId])
      return _navigationOptions.lastVisitedSections[categoryId]

    return _categorySectionMapping[categoryId][0]
  }

  /**
   * @param {string} sectionId
   */
  const registerSectionVisit = (sectionId) => {
    let targetCategoryId = null

    Object.entries(_categorySectionMapping).forEach(([categoryId, sectionArray]) => {
      if (sectionArray.includes(sectionId)) {
        targetCategoryId = categoryId
      }
    })

    _navigationOptions.lastVisitedSections[targetCategoryId] = sectionId
  }

  function _saveState() {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        isSidebarExpanded: _navigationOptions.isSidebarExpanded,
      }),
    )
  }

  return {
    init,
    isOneAtOnceMode,
    isAllAtOnceMode,
    isSidebarExpanded,
    getActiveSectionId,
    isSectionActive,
    isSectionVisible,
    getActiveCategoryId,
    isCategoryActive,
    getLastVisitedSectionOn,
    registerSectionVisit,
    setSidebarStatus,
    toggleSidebarStatus,
    update,
  }
}
