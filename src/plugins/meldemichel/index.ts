import type { PluginContainer } from '@polar/polar'

import { useMeldemichelStore } from './store'

export default function meldemichel(): PluginContainer {
	return {
		id: 'external-meldemichel',
		storeModule: useMeldemichelStore,
	}
}
