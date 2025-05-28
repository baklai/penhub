import js from '@eslint/js';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}']
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/.vite/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },

  {
    name: 'node/files-to-lint',
    files: ['**/main/**/*.js', '**/preload/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting
]);
