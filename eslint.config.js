import stylistic from '@stylistic/eslint-plugin'
import jsdoc from 'eslint-plugin-jsdoc'
import neostandard from 'neostandard'

export default [
  ...neostandard({
    ts: true,
  }),
  jsdoc.configs['flat/recommended'],
  jsdoc.configs['flat/recommended-typescript'],
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
