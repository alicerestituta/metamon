import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import prettier from 'eslint-config-prettier';

export default createConfigForNuxt({}).append(prettier, {
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-empty': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
  },
});
