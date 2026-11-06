import type { PluginOptions } from '@polar/polar'

export interface SetMapStatePayload {
	mapBaseLayer?: number | string

	/**
	 * The format resembles `'number,number'`.
	 */
	mapCenter?: string
	mapZoomLevel?: number | string
	stadtwaldActive?: boolean
	vendor_maps_address_hnr?: number | string
	vendor_maps_address_str?: string

	/**
	 * The format resembles `'number,number'`.
	 */
	vendor_maps_position?: string
}

export interface GetMapState {
	mapBaseLayer: number | string

	/**
	 * The format resembles `'number,number'`.
	 */
	mapCenter: string
	mapZoomLevel: number | string

	vendor_maps_address_plz: string

	/**
	 * Distance between address and marker.
	 */
	vendor_maps_distance_to: number
}

export interface MeldemichelPluginOptions extends PluginOptions {
	afmUrl?: string
}
