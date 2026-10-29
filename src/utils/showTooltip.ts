import type { Feature, Map } from 'ol'

import { isVisible } from '@polar/polar/lib/invisibleStyle'

export function showTooltip(feature: Feature, map: Map): [string, string][] {
	const visibleFeatures = (feature.get('features') || []).filter(isVisible)
	const isCluster = visibleFeatures.length > 1
	if (isCluster) {
		// TODO: The translations don't work (yet)
		return [
			['h2', 'meldemichel.gfi.tooltip.multiHeader'],
			[
				'span',
				`meldemichel.gfi.tooltip.multiBody${
					map.getView().getZoom() === map.getView().getMaxZoom()
						? 'Unresolvable'
						: ''
				}`,
			],
		]
	}
	const tooltipFeature = visibleFeatures[0]
	return [
		['h2', `${tooltipFeature.get('str')} ${tooltipFeature.get('hsnr')}`],
		['span', `meldemichel.skat.${tooltipFeature.get('skat')}`],
	]
}
