import 'i18next'

import type { LocaleResources } from '@polar/polar'
import type { meldemichelDe } from '../locales'
import type { afmButtonDe } from '../plugins/AfmButton/locales'

declare module 'i18next' {
	interface CustomTypeOptions {
		enableSelector: true
		resources: LocaleResources & typeof meldemichelDe & typeof afmButtonDe
	}
}
