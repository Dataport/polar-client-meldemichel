import type { PluginContainer, PolarPluginStore } from '@polar/polar'
import type { GfiPluginOptions } from '@polar/polar/plugins/gfi'

import { useGfiStore } from '@polar/polar/plugins/gfi/store'

import GfiWrapper from './GfiWrapper.vue'
import locales from './locales'

export default function pluginGfi(options: GfiPluginOptions): PluginContainer {
	return {
		id: 'gfi',
		component: GfiWrapper,
		locales,
		storeModule: useGfiStore as PolarPluginStore,
		options,
		icon: 'kern-icon-fill--location-on',
	}
}
