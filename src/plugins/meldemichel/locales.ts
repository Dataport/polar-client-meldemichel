import type { Locale } from '@polar/polar'

import { skat } from '../../locales'

export const meldemichelDe = {
	afmButton: {
		buttonText: 'Neues Anliegen',
		missingAddress:
			'Bitte geben Sie eine Adresse ein oder wählen Sie eine Position durch Klick in die Karte.',
		hint: 'Einen neuen Schaden melden',
	},
	skat,
} as const

/** @internal */
const locales: Locale[] = [
	{
		type: 'de',
		resources: meldemichelDe,
	},
]

/** @internal */
export default locales
