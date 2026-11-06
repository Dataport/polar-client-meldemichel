import type { PluginContainer } from '@polar/polar'
import type { MeldemichelPluginOptions } from './types'

import AfmButton from './AfmButton.vue'
import locales from './locales'
import { useMeldemichelStore } from './store'

export default function meldemichel(
	options: MeldemichelPluginOptions
): PluginContainer {
	return {
		id: 'external-meldemichel',
		component: AfmButton,
		locales,
		storeModule: useMeldemichelStore,
		options,
	}
}
