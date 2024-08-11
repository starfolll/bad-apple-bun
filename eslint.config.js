import antfu from '@antfu/eslint-config';
import unusedImports from 'eslint-plugin-unused-imports';

export default antfu({
  type: 'lib',

  stylistic: {
    semi: true,
  },

  typescript: true,

  plugins: {
    'unused-imports': unusedImports,
  },

  rules: {
    'antfu/if-newline': 'off',

    'ts/consistent-type-definitions': ['error', 'type'],

    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
});
