import type { Menu } from '@polar/polar/plugins/iconMenu'

import Filter from '@polar/polar/plugins/filter'
import Fullscreen from '@polar/polar/plugins/fullscreen'
import LayerChooser from '@polar/polar/plugins/layerChooser'
import Zoom from '@polar/polar/plugins/zoom'

import { MODE } from '../enums'
import { skat } from '../locales'
import Gfi from '../plugins/gfi'

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
					featureList: {
						icon: 'kern-icon--checklist',
						activeLayers: {
							plugin: 'layerChooser',
							key: 'activeMaskIds',
						},
						mode: 'visible',
						pageLength: 10,
						text: {
							title: (feature) =>
								`${feature.get('str')} ${feature.get('hsnr')}`,
							// TODO: String cant be translated, ready string is wanted ._. --> Change in POLAR --> Is "useTranslation" the solution?
							subtitle: (feature) =>
								skat[feature.get('skat') as keyof typeof skat],
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
