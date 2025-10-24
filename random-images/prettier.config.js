export default {
	arrowParens: 'avoid',
	bracketSameLine: true,
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
	printWidth: 80,
	semi: false,
	singleQuote: true,
	svelteAllowShorthand: true,
	svelteIndentScriptAndStyle: false,
	svelteSortOrder: 'options-scripts-markup-styles',
	tabWidth: 4,
	trailingComma: 'none',
	useTabs: true
}
