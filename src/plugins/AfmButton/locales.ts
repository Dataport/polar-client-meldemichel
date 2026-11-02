import type { Locale } from '@polar/polar'

export const afmButtonDe = {
	afmButton: {
		buttonText: 'Neues Anliegen',
		missingAddress:
			'Bitte geben Sie eine Adresse ein oder wählen Sie eine Position durch Klick in die Karte.',
		hint: 'Einen neuen Schaden melden',
	},
} as const

const locales: Locale[] = [
	{
		type: 'de',
		resources: {
			plugins: {
				afmButton: afmButtonDe,
			},
		},
	},
]

export default locales
