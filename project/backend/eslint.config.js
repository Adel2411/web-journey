export default [
  {
    ignores: ['node_modules', 'dist', '.env'],
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        process: 'readonly'
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      // your custom rules here
    },
  },
];