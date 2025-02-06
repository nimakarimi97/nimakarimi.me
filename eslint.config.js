import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  rules: {
    'no-console': 'off',
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'jsdoc/require-property-description': 'off',
  },
})
