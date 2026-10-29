import type { PolarMapInstance } from '@polar/polar'
import type { Map } from 'ol'
import type { Vector } from 'ol/layer'
import type { MeldemichelCreateMapParams } from './types'

import { getStore } from '@polar/polar'
import {
	fetchServiceRegister,
	createMap as originalCreateMap,
	updateState,
} from '@polar/polar'
import { toMerged } from 'es-toolkit'

import packageInfo from '../package.json'
import { addPlugins } from './addPlugins'
import { MODE } from './enums'
import { getMapConfiguration, hamburgBorder } from './mapConfigurations'
import { enableClustering } from './utils/enableClustering'
import { setBackgroundImage } from './utils/setBackgroundImage'

/*
import { addPlugin } from '@polar/polar'
import AfmButton from './plugins/AfmButton'
import meldemichelModule from './store/module'
*/

// eslint-disable-next-line no-console
console.log(`POLAR Meldemichel loaded in version ${packageInfo.version}.`)

const serviceRegister =
	'https://geoportal-hamburg.de/lgv-config/services-internet.json'

// can't be configured "visible: false" – wouldn't load at all then
const hideBorder = (map: Map) => {
	;(
		map
			.getLayers()
			.getArray()
			.find((layer) => hamburgBorder === layer.get('id')) as Vector
	).setStyle(null)
}

let memory: PolarMapInstance | null = null

export const createMap = async ({
	containerId,
	mode,
	afmUrl,
	// stadtwaldActive,
	reportServiceId,
	configOverride,
}: MeldemichelCreateMapParams) => {
	// TODO: This just re-uses one client instance reinstating the old one; Try fixing the memory leak correctly or live with this forever
	if (memory) {
		document.getElementById(containerId)?.replaceWith(memory)

		if (configOverride?.pins) {
			// update may be required on rerender
			updateState(memory, 'core', 'configuration', {
				...memory.store.configuration,
				pins: configOverride.pins,
			})
			getStore(memory, 'pins').setupInitial()
		}

		/* if (typeof stadtwaldActive === 'boolean') {
			// TODO: Adjust meldemichel everywhere to external-meldemichel
			const meldemichelStore = getStore(memory, 'external-meldemichel')

			// TODO: If statement might be redundant, check later
			if (meldemichelStore) {
				meldemichelStore.setMapState({ stadtwaldActive })
			}
		}*/
		return memory
	}
	if (!Object.keys(MODE).includes(mode)) {
		console.error(
			`@polar/client-meldemichel: Critical error. Unknown mode "${mode}" configured. Please use 'COMPLETE', 'REPORT', or 'SINGLE'.`
		)
	}
	const register = enableClustering(
		await fetchServiceRegister(serviceRegister),
		reportServiceId
	)

	const client = await originalCreateMap(
		containerId,
		toMerged(
			getMapConfiguration({ mode, afmUrl, reportServiceId }),
			configOverride || {}
		),
		register
	)

	setBackgroundImage(client)

	addPlugins(client, mode)

	// TODO: Replace with a simple addPlugin which uses the store.
	// client.$store.registerModule('meldemichel', meldemichelModule)

	/* if (mode === MODE.COMPLETE) {
				// late setup due to dependency to meldemichelModule
				addPlugin(
					client,
					AfmButton({
						displayComponent: true,
						layoutTag: NineLayoutTag.BOTTOM_RIGHT,
					})
				)
			} */

	hideBorder(client.store.map)

	/* if (typeof stadtwaldActive === 'boolean') {
				// TODO: Replace with new call
				client.$store.dispatch('meldemichel/setMapState', {
					stadtwaldActive,
				})
			} */
	memory = client
	return client
}
export default { createMap }
