// SKAT modelled by their ID; no semantic value for client.
/* eslint-disable @typescript-eslint/naming-convention */
import type { Locale } from '@polar/polar'

import { REPORT_STATUS, SKAT } from './enums'

type Skat = (typeof SKAT)[number]

export const skat = {
	100: 'Wege und Straßen',
	101: 'Schlagloch und Wegeschaden',
	102: 'Verunreinigung und Vandalismus',
	103: 'Wildwuchs und Überwuchs',
	104: 'Beschädigtes Verkehrszeichen',
	105: 'Beschädigte Brücke, Tunnel, Mauer, Treppe',
	106: 'Beschädigte Geländer, Poller, Fahrradständer, Sitzgelegenheit',
	111: 'Schrottfahrräder',
	112: 'Abgemeldete Fahrzeuge',
	113: 'Radverkehr',
	114: 'Stadtwald Hamburg',
	115: 'Stadtwald: Schäden am Baumbestand',
	116: 'Stadtwald: Schäden an Einrichtungen',
	117: 'Stadtwald: Wegeschäden',
	118: 'Stadtwald: Verschmutzung / Müll',
	119: 'Stadtwald: Illegale Aktivitäten',
	120: 'Stadtwald: Sonstige Schäden',
	200: 'Ampeln und Leuchten',
	202: 'Ampel gestört',
	203: 'beleuchtetes Schild gestört',
	204: 'Straßenbeleuchtung ausgefallen',
	205: 'Straßenbeleuchtung tagsüber in Betrieb',
	400: 'Grünanlagen und Spielplätze',
	401: 'Baumschaden',
	402: 'Spielgeräteschaden',
	500: 'Siele und Gewässer',
	501: 'Gully-Schaden',
	502: 'Graben',
	503: 'Gewässerverunreinigung',
} satisfies Record<Skat, string>

const status = {
	[REPORT_STATUS[0]]: 'In Bearbeitung',
	[REPORT_STATUS[1]]: 'Bearbeitet',
}

const filterCategory = {
	skat: { title: 'Kategorien', knownValue: skat },
	statu: { title: 'Status', knownValue: status },
}

export const meldemichelDe = {
	// TODO: Update gfi locales once component is migrated
	gfi: {
		title: 'Meldung',
		skat: 'Kategorie',
		beschr: 'Beschreibung',
		rueck: 'Rückmeldung',
		start: 'Gemeldet am',
		statu: 'Status',
		tooltip: {
			multiHeader: 'Mehrere Anliegen',
			multiBody: 'Klick zum Zoomen',
			multiBodyUnresolvable: 'Klick zum Öffnen',
		},
	},
	skat,
	// TODO: Currently not used
	// status,
} as const

const locales: Locale[] = [
	{
		type: 'de',
		resources: {
			meldemichel: meldemichelDe,
			shared: {
				pagination: {
					entries:
						'Meldung {{start}} bis {{end}} von {{total}} Schadensmeldungen',
					page: 'Öffne Seite {{page}} der Schadensmeldungen',
					next: 'Nächste Seite öffnen',
					previous: 'Vorherige Seite öffnen',
				},
			},
			filter: {
				layer: {
					6059: {
						category: filterCategory,
					},
					6061: {
						category: filterCategory,
					},
				},
			},
			geoLocation: {
				toast: {
					notInBoundary:
						'Das System konnte Sie leider nicht in Hamburg verorten. Bitte benutzen Sie Karte und Suche, um einen Schaden innerhalb von Hamburg zu melden.',
					boundaryError:
						'Die Verortung ist fehlgeschlagen. Bitte benutzen Sie Karte und Suche, um einen Schaden innerhalb von Hamburg zu melden.',
				},
			},
			gfi: {
				header: {
					close: 'Zurück zur Listenansicht der Meldungen',
					closeToList: 'Zurück zur Listenansicht der Meldungen',
				},
				list: {
					header: 'Meldungsliste',
					emptyView:
						'Im aktuellen Kartenausschnitt sind keine Meldungen enthalten.',
				},
				switch: {
					previous: 'Vorangehende Meldung',
					next: 'Nächste Meldung',
					entryXOfY: 'Meldung {{index}} von {{count}}',
				},
				noActiveLayer:
					'Die Meldungen sind derzeit ausgeschaltet. Sie können Sie über die Kartenauswahl (Buch-Symbol in der Werkzeugleiste) wieder einschalten.',
			},
			iconMenu: {
				hints: {
					gfi: 'Meldungsliste',
				},
			},
			pins: {
				toast: {
					notInBoundary:
						'Es können nur Koordinaten innerhalb von Hamburg gewählt werden.',
				},
			},
			attributions: {
				stadtplan:
					'Kartografie Stadtplan: <a target="_blank" href="https://www.hamburg.de/bsw/landesbetrieb-geoinformation-und-vermessung/">Landesbetrieb Geoinformation und Vermessung</a>',
				stadtwald:
					'Kartografie Stadtwald: <a target="_blank" href="https://www.hamburg.de/politik-und-verwaltung/behoerden/bukea">Freie und Hansestadt Hamburg, Behörde für Umwelt, Klima, Energie und Agrarwirtschaft (BUKEA)</a>',
				luftbilder:
					'Kartografie Luftbilder: <a target="_blank" href="https://www.hamburg.de/bsw/landesbetrieb-geoinformation-und-vermessung/">Landesbetrieb Geoinformation und Vermessung</a>',
				reports: 'Meldungen durch Bürger',
			},
		},
	},
]

// test for enum/locale synchronicity; error on mismatch
locales.forEach((locale) => {
	const knownLocaleSKAT = Object.keys(skat) as Skat[]
	const knownEnumSKAT = [...SKAT]
	if (knownLocaleSKAT.sort().join(',') !== knownEnumSKAT.sort().join(',')) {
		throw new Error(
			`@polar/client-meldemichel: Error in locales.ts/enums.ts: SKAT and Locales not in sync for language "${
				locale.type
			}". Affected SKAT: ${knownLocaleSKAT
				.filter((x) => !knownEnumSKAT.includes(x))
				.concat(knownEnumSKAT.filter((x) => !knownLocaleSKAT.includes(x)))
				.join(', ')}`
		)
	}
})

export default locales
