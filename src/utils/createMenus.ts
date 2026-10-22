import type { Menu } from '@polar/polar/plugins/iconMenu'

import Filter from '@polar/polar/plugins/filter'
import Fullscreen from '@polar/polar/plugins/fullscreen'
import Gfi from '@polar/polar/plugins/gfi'
import LayerChooser from '@polar/polar/plugins/layerChooser'
import Zoom from '@polar/polar/plugins/zoom'

import { MODE } from '../enums'
// TODO: Re-implement GFI like it is supposed to be done now
// import MeldemichelGfiFeature from '../plugins/Gfi'

export default function (mode: keyof typeof MODE) {
	return [
		[
			{
				plugin: LayerChooser(),
			},
			mode === MODE.COMPLETE && {
				plugin: Filter({
					layers: {},
				}),
			},
			mode === MODE.COMPLETE && {
				plugin: Gfi({
					layers: {},
					// gfiContentComponent: MeldemichelGfiFeature,
					// TODO: Width of featureList is scuffed AF
					// TODO It doesn't show objects if the features are shown immediately --> only after moving
					featureList: {
						activeLayers: {
							plugin: 'layerChooser',
							key: 'activeMaskIds',
						},
						mode: 'visible',
						pageLength: 10,
						text: {
							title: (feature) =>
								`${feature.get('str')} ${feature.get('hsnr')}`,
							subtitle: (feature) => `meldemichel.skat.${feature.get('skat')}`,
							subSubtitle: (feature) => feature.get('beschr'),
						},
						bindWithCoreHoverSelect: true,
					},
				}),
			},
			{
				plugin: Zoom(),
			},
			mode !== MODE.REPORT && {
				plugin: Fullscreen(),
			},
		].filter((x) => x /* remove `false` entries */) as Menu[],
	]
}
