/**
 * Created by Nima Karimi on 08.23.2023
 * This component will be responsible for overseeing and controlling the application's language.
 */
import { reactive } from 'vue'
import { useConstants } from './constants.js'

const constants = useConstants()

/**
 * @type {object}
 * @private
 */
const _languageData = reactive({
  supportedLanguages: [],
  defaultLanguage: null,
  selectedLanguage: null,
})

export function useLanguage() {
  /**
   * @param {Array} supportedLanguages
   */
  const init = (supportedLanguages) => {
    _languageData.supportedLanguages = supportedLanguages
    _languageData.defaultLanguage = supportedLanguages.find(language => language.default) || supportedLanguages[0]
    _detectInitialLanguage()
  }

  /**
   * @private
   */
  function _detectInitialLanguage() {
    const localStorageItem = window.localStorage.getItem(constants.LOCAL_STORAGE_ITEMS.language)

    if (!localStorageItem) {
      const detectedLanguage = _languageData.supportedLanguages.find(language =>
        navigator.language.includes(language.id),
      )
      selectLanguage(detectedLanguage || _languageData.defaultLanguage)
    } else {
      selectLanguage(_findLanguageWithId(localStorageItem) || _languageData.defaultLanguage)
    }
  }

  /**
   * @return {boolean}
   */
  const supportsMultipleLanguages = () => {
    return _languageData.supportedLanguages.length > 1
  }

  /**
   * @return {object | null}
   */
  const getSelectedLanguage = () => {
    return _languageData.selectedLanguage
  }

  /**
   * @return {object | null}
   */
  const getDefaultLanguage = () => {
    return _languageData.defaultLanguage
  }

  /**
   * @return {object[]}
   */
  const getAvailableLanguages = () => {
    return _languageData.supportedLanguages.filter(
      language => language.id !== _languageData.selectedLanguage.id,
    )
  }

  /**
   * @param {object} language
   */
  function selectLanguage(language) {
    _languageData.selectedLanguage = language
    window.localStorage.setItem(constants.LOCAL_STORAGE_ITEMS.language, language.id)
  }

  /**
   * @param {string} languageId
   * @return {object}
   * @private
   */
  function _findLanguageWithId(languageId) {
    return _languageData.supportedLanguages.find(language => language.id === languageId) || null
  }

  return {
    init,
    supportsMultipleLanguages,
    getSelectedLanguage,
    getDefaultLanguage,
    getAvailableLanguages,
    selectLanguage,
  }
}
