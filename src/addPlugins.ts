import type { PluginContainer, PolarMapInstance } from '@polar/polar'
import type { MpapiParameters } from '@polar/polar/lib/getFeatures/types'

import { addPlugins as originalAddPlugins } from '@polar/polar'
import AddressSearch from '@polar/polar/plugins/addressSearch'
import Attributions from '@polar/polar/plugins/attributions'
import GeoLocation from '@polar/polar/plugins/geoLocation'
import IconMenu from '@polar/polar/plugins/iconMenu'
import LoadingIndicator from '@polar/polar/plugins/loadingIndicator'
import Pins from '@polar/polar/plugins/pins'
import ReverseGeocoder from '@polar/polar/plugins/reverseGeocoder'
import Scale from '@polar/polar/plugins/scale'
import Toast from '@polar/polar/plugins/toast'

import { MODE } from './enums'
import { hamburgBorder, hamburgRed } from './mapConfigurations.ts'
import createMenus from './utils/createMenus'

export const addPlugins = (
	client: PolarMapInstance,
	mode: keyof typeof MODE
) => {
	const iconMenu = IconMenu({
		initiallyOpen: 'layerChooser',
		displayComponent: true,
		menus: createMenus(mode),
		layoutTag: 'TOP_RIGHT',
	})

	originalAddPlugins(
		client,
		[
			// TODO: Results flow out of the map (bottom)
			AddressSearch({
				displayComponent: mode !== MODE.SINGLE,
				layoutTag: 'TOP_LEFT',
				minLength: 3,
				waitMs: 300,
				searchMethods: [
					{
						queryParameters: {
							searchAddress: true,
							searchStreets: true,
							searchHouseNumbers: true,
						} as MpapiParameters,
						type: 'mpapi',
						url: 'https://geodienste.hamburg.de/HH_WFS_GAGES?service=WFS&request=GetFeature&version=2.0.0',
					},
				],
			}),
			Pins({
				coordinateSources: [{ plugin: 'addressSearch', key: 'chosenAddress' }],
				toZoomLevel: 7,
				movable: 'drag',
				style: {
					fill: hamburgRed,
				},
				boundary: {
					layerId: hamburgBorder,
				},
			}),
			iconMenu,
			Attributions({
				displayComponent: true,
				layoutTag: 'BOTTOM_RIGHT',
				windowWidth: 550,
				listenToChanges: [
					{
						key: 'activeBackgroundId',
						plugin: 'layerChooser',
					},
					{
						key: 'visibleMaskIds',
						plugin: 'layerChooser',
					},
					{
						key: 'zoom',
					},
				],
			}),
			LoadingIndicator({
				displayComponent: true,
				layoutTag: 'MIDDLE_MIDDLE',
			}),
			Scale({
				displayComponent: true,
				layoutTag: 'BOTTOM_RIGHT',
			}),
			Toast({
				displayComponent: true,
				layoutTag: 'BOTTOM_MIDDLE',
			}),
			mode !== MODE.SINGLE &&
				GeoLocation({
					checkLocationInitially: true,
					zoomLevel: 7,
					boundary: {
						layerId: hamburgBorder,
						onError: 'strict',
					},
					showTooltip: true,
				}),
			ReverseGeocoder({
				type: 'wps',
				url: 'https://geodienste.hamburg.de/HH_WPS',
				coordinateSources: [
					{
						plugin: 'pins',
						key: 'coordinate',
					},
				],
				addressTarget: {
					plugin: 'addressSearch',
					key: 'selectResult',
				},
				zoomTo: 7,
			}),
		].filter((x) => x /* remove `false` entries */) as PluginContainer[]
	)
}
