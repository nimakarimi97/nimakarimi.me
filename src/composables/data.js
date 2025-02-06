import { reactive } from 'vue'
import { useConstants } from './constants.js'
import { useLanguage } from './language.js'
import { useUtils } from './utils.js'

const constants = useConstants()
const language = useLanguage()
const utils = useUtils()

/**
 * @type {object}
 * @private
 */
const _jsonData = reactive({
  sections: [],
  categories: [],
  places: null,
  profile: null,
  settings: null,
  strings: null,
})

/**
 * @type {object}
 * @private
 */
const _progressData = reactive({
  loadedFiles: 0,
  totalFiles: 5,
})

/**
 * @type {{language: string, entries: object}}
 * @private
 */
const _localizedData = reactive({ language: null, entries: null })

/**
 * @type {object}
 * @private
 */
let _localizationsCache = {}

export function useData() {
  /**
   * Fetch only essential stuff for booting up the app.
   * @return {Promise<void>}
   */
  const fetchEssentials = async () => {
    const jSections = await _loadJson(`${constants.BASE_PATH}/data/sections.json`)
    const jSettings = await _loadJson(`${constants.BASE_PATH}/data/settings.json`)
    const jStrings = await _loadJson(`${constants.BASE_PATH}/data/strings.json`)

    _jsonData.sections = jSections.sections
    _jsonData.categories = jSections.categories
    _jsonData.settings = jSettings
    _jsonData.strings = jStrings

    _progressData.loadedFiles = 3
    _progressData.totalFiles += _jsonData.sections.length
  }

  /**
   * @return {Promise<void>}
   */
  const fetchAll = async () => {
    const jPlaces = await _loadJson(`${constants.BASE_PATH}/data/info/places.json`)
    const jProfile = await _loadJson(`${constants.BASE_PATH}/data/info/profile.json`)

    _jsonData.places = jPlaces
    _jsonData.profile = jProfile
    _progressData.loadedFiles = 5

    await _loadSections()
    Object.values(_jsonData).forEach(_evaluateObject)

    _localizationsCache = {}
    _localizedData.language = null
    _localizedData.entries = null
  }

  /**
   * @return {Array}
   */
  const getSections = () => {
    _updateLocalization()
    return _localizedData.entries.sections
  }

  /**
   * @return {Array}
   */
  const getCategories = () => {
    _updateLocalization()
    return _localizedData.entries.categories
  }

  /**
   * @param {string} categoryId
   * @return {Array}
   */
  const getCategorySections = (categoryId) => {
    return getSections().filter(section => section.categoryId === categoryId)
  }

  /**
   * @return {object}
   */
  const getProfile = () => {
    _updateLocalization()
    return _localizedData.entries.profile
  }

  /**
   * @return {object}
   */
  const getSettings = () => {
    return _jsonData.settings
  }

  /**
   * @param {string} string
   * @return {string}
   */
  const getString = (string) => {
    _updateLocalization()
    return _localizedData.entries.strings.locales[string]
  }

  /**
   * @return {number}
   */
  const getLoadProgress = () => {
    const percentage = (100 * _progressData.loadedFiles) / _progressData.totalFiles
    return utils.clamp(Math.round(percentage), 0, 100)
  }

  /**
   * @return {boolean}
   */
  // function isReady() {
  //   return getLoadProgress() === 100
  // }

  /**
   * @param path
   * @return {object}
   * @private
   */
  async function _loadJson(path) {
    const request = await fetch(path)
    return request.json()
  }

  /**
   * @return {Promise<void>}
   * @private
   */
  async function _loadSections() {
    for (const section of _jsonData.sections) {
      const sectionId = section.id
      const sectionCategoryId = section.categoryId
      const sectionCategory = _findObjectWithId(_jsonData.categories, sectionCategoryId)
      const jsonPath = section.jsonPath

      if (!sectionCategory) {
        throw new Error(
          `The section with id "${sectionId}" has an invalid categoryId "${sectionCategoryId}". There's no such category.`,
        )
      }

      sectionCategory.sectionIds = sectionCategory.sectionIds || []
      sectionCategory.sectionIds.push(sectionId)

      if (utils.isStringAJSONUrl(jsonPath)) {
        section.content = await _loadJson(jsonPath)
      } else {
        section.content = {}
      }

      _progressData.loadedFiles++
    }

    /** Delete empty categories, if there's any... */
    for (let i = _jsonData.categories.length - 1; i >= 0; i--) {
      const categorySectionIds = _jsonData.categories[i].sectionIds
      if (!categorySectionIds || categorySectionIds.length === 0) {
        _jsonData.categories.splice(i, 1)
      }
    }
  }

  /**
   * @param {Array} collection
   * @param {string} objectId
   * @return {*|null}
   * @private
   */
  function _findObjectWithId(collection, objectId) {
    return collection.find(item => item.id === objectId) || null
  }

  /**
   * @param {object} object
   * @return {object}
   * @private
   */
  function _evaluateObject(object) {
    if (typeof object === 'string') {
      return _parseStringField(object)
    } else if (typeof object === 'object') {
      for (const i in object) {
        object[i] = _evaluateObject(object[i])
      }
    }

    return object
  }

  /**
   * @param {string} fieldValue
   * @return {string | *}
   * @private
   */
  function _parseStringField(fieldValue) {
    /** String follows the pattern @link{...} - must create a reference to an object from another json file */
    // eslint-disable-next-line regexp/no-unused-capturing-group
    if (/@link\{([^}]*)\}/.test(fieldValue)) {
      return _resolveCrossJsonReference(fieldValue)
    }

    return fieldValue
  }

  /**
   * @param {string} evalString
   * @return {string}
   * @private
   */
  function _resolveCrossJsonReference(evalString) {
    const match = evalString.match(/@link\{([^}]*)\}/)
    if (!match) {
      throw new Error(`Invalid cross json-reference: ${evalString}`)
    }

    const expression = match[1]
    const [targetId, ...fields] = expression.split('.')
    const targetObject = _jsonData[targetId] || _findObjectWithId(_jsonData.sections, targetId)?.content

    if (!targetObject) {
      throw new Error(`Can't resolve cross json-reference. Target JSON doesn't exist: ${evalString}`)
    }

    let resolvedObject = targetObject

    for (const field of fields) {
      if (typeof resolvedObject === 'object') {
        resolvedObject = resolvedObject[field]
      } else {
        resolvedObject = null
      }

      if (!resolvedObject) {
        throw new Error(
          `Can't resolve cross json-reference. Target property doesn't exist on specified JSON: ${evalString}`,
        )
      }
    }

    return resolvedObject
  }

  /**
   * @private
   */
  function _updateLocalization() {
    const currentLanguageId = language.getSelectedLanguage().id
    if (!_localizationsCache[currentLanguageId]) {
      _localizationsCache[currentLanguageId] = _cacheLocalization(_jsonData, currentLanguageId)
    }

    _localizedData.language = currentLanguageId
    _localizedData.entries = _localizationsCache[currentLanguageId]
  }

  /**
   * @param {object} object
   * @param {string} languageId
   * @private
   */
  function _cacheLocalization(object, languageId) {
    const localizedFields = {}

    if (typeof object === 'string' || typeof object === 'number' || typeof object === 'boolean')
      return object

    for (const [key, value] of Object.entries(object)) {
      if (Array.isArray(value)) {
        localizedFields[key] = value.map(valueItem => _cacheLocalization(valueItem, languageId))
      } else if (key.includes('locales')) {
        localizedFields[key] = _getLocalizedEntries(value, languageId)
      } else if (value !== null && value !== undefined) {
        localizedFields[key] = _cacheLocalization(value, languageId)
      } else {
        localizedFields[key] = value
      }
    }

    return localizedFields
  }

  /**
   * @param {object} localesHash
   * @param {string} languageId
   * @private
   */
  function _getLocalizedEntries(localesHash, languageId) {
    const localizedEntries = {}
    const defaultLanguageId = language.getDefaultLanguage().id

    for (const string in localesHash[defaultLanguageId]) {
      let translation = localesHash[languageId]?.[string]
      if (!translation)
        translation = localesHash[defaultLanguageId][string]

      localizedEntries[string] = translation
    }

    return localizedEntries
  }

  return {
    fetchEssentials,
    fetchAll,
    getLoadProgress,
    getSections,
    getCategories,
    getCategorySections,
    getProfile,
    getSettings,
    getString,
  }
}
