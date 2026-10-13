// @ts-expect-error | TODO: Fix it with type declarations in @polar/polar or locally as a shim
import '@polar/polar/polar.css'
import { createMap } from '@polar/polar'

await createMap(
	'map',
	{
		layers: [
			{
				id: '453',
				visibility: true,
				type: 'background',
				name: 'Stadtplan',
			},
		],
		startCenter: [565874, 5934140],
	},
	'https://geoportal-hamburg.de/lgv-config/services-internet.json'
)
