// ESLint flat config (ESLint 9). Expo's rules + Prettier compatibility.
const expoConfig = require('eslint-config-expo/flat');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  ...expoConfig,
  eslintConfigPrettier,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.expo/**',
      'docs/**',
      'coverage/**',
    ],
  },
];
