import type { Locale } from '@polar/polar'

import { status } from '../../locales'

export const gfiDe = {
	close: 'Zurück zur Listenansicht der Meldungen',
	list: {
		header: 'Meldungsliste',
		emptyView: 'Im aktuellen Kartenausschnitt sind keine Meldungen enthalten.',
		noActiveLayer:
			'Die Meldungen sind derzeit ausgeschaltet. Sie können sie über die Kartenauswahl (Buch-Symbol in der Werkzeugleiste) wieder einschalten.',
	},
	switch: {
		previous: 'Vorangehende Meldung',
		next: 'Nächste Meldung',
		entryXOfY: 'Meldung {{index}} von {{count}}',
	},
	properties: {
		beschr: 'Beschreibung',
		rueck: 'Rückmeldung',
		skat: 'Kategorie',
		start: 'Gemeldet am',
		statu: 'Status',
	},
	imageAlt: 'Bild von der Meldung',
	tooltip: {
		multiHeader: 'Mehrere Anliegen',
		multiBody: 'Klick zum Zoomen',
		multiBodyUnresolvable: 'Klick zum Öffnen',
	},
	status,
} as const

/** @internal */
const locales: Locale[] = [
	{
		type: 'de',
		resources: gfiDe,
	},
]

/** @internal */
export default locales
