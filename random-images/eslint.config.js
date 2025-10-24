import { fileURLToPath } from 'node:url'
import { includeIgnoreFile } from '@eslint/compat'
import prettier from 'eslint-config-prettier'
import js from '@eslint/js'
import svelte from 'eslint-plugin-svelte'
import ts from 'typescript-eslint'
import globals from 'globals'
import svelteConfig from './svelte.config.js'
import storybook from 'eslint-plugin-storybook'

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url))

export default [
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	...ts.configs.recommended,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.js', '**/*.svelte.ts'],
		languageOptions: { parserOptions: { svelteConfig } }
	},
	...storybook.configs['flat/recommended'],
	{
		ignores: ['./GOOGLE_SHEETS_SETUP_files/**']
	}
]
