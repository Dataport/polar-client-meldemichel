import type { Map } from 'ol'
import type { Vector } from 'ol/layer'
import type { MeldemichelCreateMapParams } from './types'

import { addPlugin, subscribe } from '@polar/polar'
import {
	fetchServiceRegister,
	createMap as originalCreateMap,
} from '@polar/polar'
import { toMerged } from 'es-toolkit'
import kernExtraIcons from 'virtual:kern-extra-icons'

import packageInfo from '../package.json'
import { addPlugins } from './addPlugins'
import { MODE } from './enums'
import { getMapConfiguration, hamburgBorder } from './mapConfigurations'
import meldemichel from './plugins/meldemichel'
import { useMeldemichelStore } from './plugins/meldemichel/store'
import { enableClustering } from './utils/enableClustering'
import { setBackgroundImage } from './utils/setBackgroundImage'

// eslint-disable-next-line no-console
console.log(
	`@polar/client-meldemichel loaded in version ${packageInfo.version}.`
)

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

export const createMap = async ({
	containerId,
	mode,
	afmUrl,
	stadtwaldActive,
	reportServiceId,
	configOverride,
}: MeldemichelCreateMapParams) => {
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
			getMapConfiguration({ mode, reportServiceId }),
			configOverride || {}
		),
		register
	)
	// TODO: Document in POLAR that clients have to add their own extra icons sheet to the shadowRoot if they were to use additional ones. --> Unless you define no icons yourself, then no need
	client.shadowRoot?.adoptedStyleSheets.push(kernExtraIcons)

	setBackgroundImage(client)

	addPlugins(client, mode)
	addPlugin(
		client,
		meldemichel({
			afmUrl,
			displayComponent: mode === MODE.COMPLETE,
			layoutTag: 'BOTTOM_RIGHT',
		})
	)

	hideBorder(client.store.map)

	if (typeof stadtwaldActive === 'boolean') {
		useMeldemichelStore().setMapState({
			stadtwaldActive,
		})
	}
	return client
}
export { subscribe }
export default { createMap, subscribe }
