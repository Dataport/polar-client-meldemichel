import type { MapConfiguration } from '@polar/polar'
import type {
	Attribution,
	AttributionsPluginOptions,
} from '@polar/polar/plugins/attributions'
import type { FilterPluginOptions } from '@polar/polar/plugins/filter'
import type { MeldemichelCreateMapParams } from './types'

import { MODE, REPORT_STATUS, SKAT } from './enums'
// TODO: Add unique locales
// import locales from './locales'
// TODO: Add tooltip
// import { showTooltip } from './utils/showTooltip'

export const stadtwald = '18746'
const stadtplan = '453'
const luftbilder = '34127'
export const hamburgBorder = '1693' // boundary layer for pins / geolocalization
// const hamburgWhite = '#ffffff'
// const hamburgDarkBlue = '#003063'
export const hamburgRed = '#ff0019'

const commonMapConfiguration: MapConfiguration = {
	checkServiceAvailability: false, // service register too long
	colorScheme: 'light', // TODO: Change to system once bug is fixed
	startCenter: [565874, 5934140],
	// locales,
	layers: [
		{
			id: stadtplan,
			visibility: true,
			type: 'background',
			name: 'meldemichel.layers.stadtplan',
		},
		{
			id: luftbilder,
			type: 'background',
			name: 'meldemichel.layers.luftbilder',
		},
		{
			id: hamburgBorder,
			visibility: true,
			hideInMenu: true,
			type: 'mask',
			name: 'meldemichel.layers.hamburgBorder',
		},
	],

	/* TODO: Change theme through KERN
	vuetify: {
		theme: {
			themes: {
				light: {
					primary: hamburgDarkBlue,
					primaryContrast: hamburgWhite,
					secondary: hamburgWhite,
					secondaryContrast: hamburgDarkBlue,
				},
			},
		},
	}, */
}

const commonAttributions: AttributionsPluginOptions = {
	initiallyOpen: false,
	layerAttributions: [
		{
			id: stadtplan,
			title: 'meldemichel.attributions.stadtplan',
		},
		{
			id: luftbilder,
			title: 'meldemichel.attributions.luftbilder',
		},
	],
}

const getFilterConfiguration = (id: string): FilterPluginOptions => ({
	layers: {
		[id]: {
			categories: [
				{
					selectAll: true,
					targetProperty: 'skat',
					knownValues: [...SKAT],
				},
				{
					targetProperty: 'statu',
					knownValues: [...REPORT_STATUS],
				},
			],
			time: {
				targetProperty: 'start',
				pattern: 'YYYYMMDD',
				last: [7, 30],
				freeSelection: 'until',
			},
		},
	},
})

const mapConfigurations: Record<
	keyof typeof MODE,
	(reportServiceId: string, afmUrl: string) => MapConfiguration
> = {
	[MODE.COMPLETE]: (reportServiceId: string /*, afmUrl: string*/) => {
		return {
			...commonMapConfiguration,
			markers: {
				layers: [
					{
						id: reportServiceId,
						defaultStyle: {
							stroke: '#FFFFFF',
							fill: '#005CA9',
						},
						hoverStyle: {
							stroke: '#46688E',
							fill: '#8BA1B8',
						},
						selectionStyle: {
							stroke: '#FFFFFF',
							fill: '#E10019',
						},
					},
				],
				callOnMapSelect: {
					action: 'openMenuById',
					payload: 'gfi',
					pluginName: 'iconMenu',
				},
				clusterClickZoom: true,
			},
			layers: [
				...commonMapConfiguration.layers,
				{
					id: reportServiceId,
					visibility: true,
					type: 'mask',
					name: 'meldemichel.layers.reports',
				},
			],
			attributions: {
				...commonAttributions,
				layerAttributions: [
					...(commonAttributions.layerAttributions as Attribution[]),
					{
						id: reportServiceId,
						title: 'meldemichel.attributions.reports',
					},
				],
				staticAttributions: [
					'<a href="https://www.hamburg.de/impressum/" target="_blank">Impressum</a>',
				],
			},
			filter: getFilterConfiguration(reportServiceId),
			gfi: {
				layers: {
					[reportServiceId]: {
						geometry: false,
						window: true,
						// translation in meldemichel's local gfi override
						properties: [
							'str',
							'hsnr',
							'pic',
							'skat',
							'beschr',
							'rueck',
							'start',
							'statu',
						],
						// showTooltip,
					},
				},
			},

			/* meldemichel: {
				afmButton: { afmUrl },
			},*/
		}
	},
	[MODE.REPORT]: () => ({
		...commonMapConfiguration,
		attributions: commonAttributions,
	}),
	[MODE.SINGLE]: () => ({
		...commonMapConfiguration,
		layers: [
			...commonMapConfiguration.layers,
			{
				id: stadtwald,
				visibility: false,
				type: 'mask',
				name: 'meldemichel.layers.stadtwald',
			},
		],
		attributions: {
			...commonAttributions,
			layerAttributions: [
				...(commonAttributions.layerAttributions as Attribution[]),
				{
					id: stadtwald,
					title: 'meldemichel.attributions.stadtwald',
				},
			],
		},
	}),
}

export const getMapConfiguration = ({
	mode,
	afmUrl,
	reportServiceId,
}: Pick<
	MeldemichelCreateMapParams,
	'mode' | 'afmUrl' | 'reportServiceId'
>): MapConfiguration => {
	if (mode === MODE.COMPLETE && typeof reportServiceId === 'undefined') {
		throw new Error(
			`@polar/client-meldemichel: Missing reportServiceId configuration in mode ${mode}.`
		)
	}
	return {
		// @ts-expect-error | reportServiceId might be undefined, but that's caught above for relevant cases
		...mapConfigurations[mode](reportServiceId, afmUrl),
	}
}
