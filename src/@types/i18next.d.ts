import 'i18next'

import type { LocaleResources } from '@polar/polar'
import type { meldemichelDe } from '../locales'
import type { meldemichelDe as meldemichelPluginDe } from '../plugins/meldemichel/locales'

declare module 'i18next' {
	interface CustomTypeOptions {
		enableSelector: true
		resources: LocaleResources & {
			meldemichel: typeof meldemichelDe
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'external-meldemichel': typeof meldemichelPluginDe
		}
	}
}
