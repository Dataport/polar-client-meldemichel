import 'i18next'

import type { LocaleResources } from '@polar/polar'
import type { gfiDe } from '../plugins/gfi/locales'
import type { meldemichelDe as meldemichelPluginDe } from '../plugins/meldemichel/locales'

declare module 'i18next' {
	interface CustomTypeOptions {
		enableSelector: true
		resources: Omit<LocaleResources, 'gfi'> & {
			gfi: typeof gfiDe
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'external-meldemichel': typeof meldemichelPluginDe
		}
	}
}
