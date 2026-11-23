import type { GetMapState, SetMapStatePayload } from './types'

import { useAddressSearchStore } from '@polar/polar/plugins/addressSearch/store'
import { useLayerChooserStore } from '@polar/polar/plugins/layerChooser/store'
import { usePinsStore } from '@polar/polar/plugins/pins/store'
import { useCoreStore } from '@polar/polar/store'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, watch } from 'vue'

import { stadtwald } from '../../mapConfigurations'

const readAfmCoordinate = (coordinate: string): number[] =>
	coordinate.split(',').map((s) => Number(s))

// Plain values only, so that a torn down map can be garbage collected.
let lastMapState: SetMapStatePayload | null = null

export const useMeldemichelStore = defineStore('external-meldemichel', () => {
	const coreStore = useCoreStore()
	const addressSearchStore = useAddressSearchStore()
	const layerChooserStore = useLayerChooserStore()
	const pinsStore = usePinsStore()

	const mapState = computed<GetMapState>(() => {
		let address = addressSearchStore.chosenAddress
		if (address?.type !== 'reverse_geocoded') {
			// wait for reverse geocoder result
			address = null
		}

		return {
			mapCenter: coreStore.center.join(','),
			mapZoomLevel: coreStore.zoom,
			mapBaseLayer: layerChooserStore.activeBackgroundId,
			vendor_maps_position: pinsStore.coordinate?.join(',') || undefined,
			vendor_maps_address_str: address?.properties?.Strasse,
			vendor_maps_address_hnr:
				address && address.properties
					? `${address.properties.Hausnr}${address.properties.Zusatz}`
					: undefined,
			vendor_maps_address_plz: address?.properties?.Plz,
			vendor_maps_distance_to: address?.properties?.Distanz,
		}
	})

	function setMapState({
		mapCenter,
		mapZoomLevel,
		mapBaseLayer,
		stadtwaldActive,
		vendor_maps_position,
		vendor_maps_address_str,
		vendor_maps_address_hnr,
	}: SetMapStatePayload) {
		if (mapCenter) {
			coreStore.center = readAfmCoordinate(mapCenter)
		}

		if (mapZoomLevel) {
			coreStore.zoom = Number(mapZoomLevel)
		}

		if (mapBaseLayer) {
			layerChooserStore.activeBackgroundId = String(mapBaseLayer)
		}

		if (typeof stadtwaldActive === 'boolean') {
			layerChooserStore.activeMaskIds = stadtwaldActive
				? [...new Set([...layerChooserStore.activeMaskIds, stadtwald])]
				: layerChooserStore.activeMaskIds.filter((id) => id !== stadtwald)
		}

		if (vendor_maps_address_str && vendor_maps_address_hnr) {
			addressSearchStore.inputValue = `${vendor_maps_address_str} ${vendor_maps_address_hnr}`
		}

		if (vendor_maps_position) {
			pinsStore.coordinate = readAfmCoordinate(vendor_maps_position)
		}
	}

	const stadtwaldActive = computed(() =>
		layerChooserStore.activeMaskIds.includes(stadtwald)
	)

	watch([mapState, stadtwaldActive], ([state, active]) => {
		lastMapState = { ...state, stadtwaldActive: active }
	})

	function setupPlugin() {
		if (!lastMapState) {
			return
		}
		setMapState(lastMapState)
		// A newly configured initial pin takes precedence over the restored one.
		if (coreStore.configuration.pins?.initial) {
			pinsStore.setupInitial()
		}
	}

	return {
		/**
		 * Current state of the map to be easily modified by the client.
		 */
		mapState,

		/**
		 * Helper function to more easily modify the state of the map.
		 */
		setMapState,

		/**
		 * Restores the state of a previously created map.
		 *
		 * @internal
		 */
		setupPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useMeldemichelStore, import.meta.hot))
}
