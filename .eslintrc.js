/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
module.exports = {
  extends: [
    // We will use the default rules from the plugins we have installed.
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    // Disable rules where eslint conflicts with prettier.
    // Leave this below so it overrides the rules above!.
    'eslint-config-prettier',
    'prettier'
  ],
  plugins: ['prettier'],
  settings: {
    react: {
      // Tell eslint-plugin-react to automatically know the version of React.
      version: 'detect'
    },
    // Tell ESLint how to handle imports
    'import/resolver': {
      node: {
        paths: [path.resolve(__dirname)],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  env: {
    node: true
  },
  rules: {
    // Turn off the rule that requires React to be imported in the jsx file
    'react/react-in-jsx-scope': 'off',
    // Warn when <a target='_blank'> tag without rel="noreferrer"
    'react/jsx-no-target-blank': 'warn',
    // Enhanced some prettier rules (copy from .prettierrc file via)
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        semi: false,
        trailingComma: 'none',
        tabWidth: 2,
        endOfLine: 'auto',
        useTabs: false,
        singleQuote: true,
        printWidth: 120,
        jsxSingleQuote: true
      }
    ]
  }
}
