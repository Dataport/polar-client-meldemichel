import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import dts from 'unplugin-dts/vite'
import checker from 'vite-plugin-checker'
import kernExtraIcons from 'vite-plugin-kern-extra-icons'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
	plugins: [
		vue({
			template: {
				compilerOptions: {
					// `polar-map` and `kern-*` are custom elements provided at runtime.
					isCustomElement: (tag) => tag.includes('-'),
				},
			},
		}),
		kernExtraIcons({ cssLayer: 'kern-ux-icons' }),
		dts({ bundleTypes: true, processor: 'vue' }),
		...(mode === 'development'
			? [
					checker({
						vueTsc: true,
						eslint: {
							useFlatConfig: true,
							lintCommand: 'eslint .',
							watchPath: ['./src', './vite.config.ts'],
						},
					}),
				]
			: []),
	],
	resolve: {
		// Ensure a single Vue/Pinia runtime is used across POLAR and this client.
		dedupe: ['vue', 'pinia'],
	},
	server: {
		port: 1337,
	},
	build: {
		lib: {
			name: 'POLAR Meldemichel Client',
			formats: ['es'],
			entry: resolve(import.meta.dirname, 'src/polar-client.ts'),
			fileName: 'polar-client',
		},
		sourcemap: true,
		target: 'esnext',
		rollupOptions: {
			// Provided by the host / shared with POLAR at runtime, not bundled.
			external: [
				'vue',
				'pinia',
				'ol',
				/^ol\//,
				'@polar/polar',
				/^@polar\/polar\//,
			],
		},
	},
	test: {
		environment: 'jsdom',
		include: ['src/**/*.spec.ts'],
		includeSource: ['src/**/*.ts'],
		coverage: {
			all: true,
			include: ['src/**/*.{ts,vue}'],
			exclude: ['**/*.d.ts', 'src/test/**', 'src/html/**'],
		},
	},
	define: {
		// Strip in-source test blocks from production builds.
		'import.meta.vitest': 'undefined',
	},
}))
