import neostandard from 'neostandard'
import jsdoc from 'eslint-plugin-jsdoc'
import stylistic from '@stylistic/eslint-plugin'

export default [
  ...neostandard(),
  jsdoc.configs['flat/recommended'],
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/space-before-function-paren': ['error', 'never'],
      '@stylistic/comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'always-multiline',
        },
      ],
    },
  },
]
