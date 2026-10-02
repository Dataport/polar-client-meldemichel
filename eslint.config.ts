import mainConfig from '@dataport/eslint-config-geodev'
import browserConfig from '@dataport/eslint-config-geodev/browser'
import htmlConfig from '@dataport/eslint-config-geodev/html'
import jsonConfig from '@dataport/eslint-config-geodev/json'
import markdownConfig from '@dataport/eslint-config-geodev/markdown'
import plugins from '@dataport/eslint-config-geodev/plugins'
import tsConfig from '@dataport/eslint-config-geodev/typescript'
import vueConfig from '@dataport/eslint-config-geodev/vue'
import importX from 'eslint-plugin-import-x'
import prettierConfig from 'eslint-plugin-prettier/recommended'
import { defineConfig } from 'eslint/config'

const { perfectionist, vue } = plugins

/**
 * Client-specific ESLint configuration (aligned with POLAR core conventions).
 */
const clientConfig = defineConfig({
	plugins: {
		perfectionist,
		vue,
		'import-x': importX,
	},
	rules: {
		'prettier/prettier': 'error',

		// Re-enable rules that are disabled by prettier but do not collide
		curly: ['error', 'all'],

		// POLAR-specific rules
		'no-warning-comments': 'warn',
		'no-void': 'off',
		'@stylistic/lines-around-comment': [
			'error',
			{
				beforeBlockComment: true,
				allowBlockStart: true,
				allowObjectStart: true,
				allowArrayStart: true,
				allowClassStart: true,
				allowEnumStart: true,
				allowInterfaceStart: true,
				allowModuleStart: true,
				allowTypeStart: true,
			},
		],
		'import-x/order': 'off',
		'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
		'perfectionist/sort-imports': [
			'error',
			{
				groups: [
					'type-import',
					{ newlinesBetween: 0 },
					'type-internal',
					{ newlinesBetween: 0 },
					'type-parent',
					{ newlinesBetween: 0 },
					'type-sibling',
					{ newlinesBetween: 0 },
					'type-index',
					['value-builtin', 'value-external'],
					'value-internal',
					['value-parent', 'value-sibling', 'value-index'],
					'ts-equals-import',
					'unknown',
				],
			},
		],
		'perfectionist/sort-named-imports': 'error',
		'vue/html-self-closing': ['error', { html: { void: 'always' } }],
	},
})

const clientTsConfig = defineConfig({
	rules: {
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/restrict-template-expressions': [
			'error',
			{ allowAny: true, allowNumber: true },
		],

		// POLAR-specific rules
		'perfectionist/sort-interfaces': [
			'error',
			{ type: 'natural', groups: ['required-member', 'unknown'] },
		],
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{
				disallowTypeAnnotations: true,
				fixStyle: 'separate-type-imports',
				prefer: 'type-imports',
			},
		],
	},
})

const clientVueConfig = defineConfig({
	rules: {
		// POLAR-specific rules
		'vue/no-empty-component-block': 'error',
		'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
		'vue/block-lang': [
			'error',
			{
				template: { allowNoLang: true },
				script: { lang: 'ts' },
				style: { allowNoLang: true },
			},
		],
		'vue/component-api-style': ['error', ['script-setup', 'composition']],
		'vue/require-default-export': 'error',
		'vue/enforce-style-attribute': ['error', { allow: ['scoped'] }],
	},
})

const clientHtmlConfig = defineConfig({
	rules: {
		// POLAR-specific rules
		'@html-eslint/require-closing-tags': ['error', { selfClosing: 'always' }],
		'@html-eslint/no-extra-spacing-attrs': [
			'error',
			{ enforceBeforeSelfClose: true },
		],
		'@html-eslint/no-extra-spacing-tags': [
			'error',
			{ enforceBeforeSelfClose: true },
		],
	},
})

export default defineConfig([
	{
		ignores: ['node_modules/', 'dist/', '**/dist/**', 'coverage/', '*.d.ts'],
	},
	{
		files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
		extends: [mainConfig, browserConfig, prettierConfig, clientConfig],
	},
	{
		files: ['**/*.ts'],
		extends: [
			mainConfig,
			browserConfig,
			tsConfig,
			prettierConfig,
			clientConfig,
			clientTsConfig,
		],
	},
	{
		files: ['eslint.config.ts', 'vite.config.ts'],
		rules: { '@typescript-eslint/naming-convention': 'off' },
	},
	{
		files: ['**/*.vue'],
		extends: [
			mainConfig,
			browserConfig,
			tsConfig,
			vueConfig,
			prettierConfig,
			clientConfig,
			clientTsConfig,
			clientVueConfig,
		],
	},
	{
		files: ['**/*.json'],
		ignores: ['package-lock.json'],
		extends: [jsonConfig],
	},
	{
		files: ['**/*.md'],
		extends: [markdownConfig],
	},
	{
		files: ['**/*.html'],
		extends: [htmlConfig, clientHtmlConfig],
	},
])
