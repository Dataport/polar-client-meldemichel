import type { MapConfiguration } from '@polar/polar'
import type { MODE } from './enums'

export interface MeldemichelCreateMapParams {
	containerId: string
	mode: keyof typeof MODE
	afmUrl?: string
	configOverride?: MapConfiguration
	reportServiceId?: string
	stadtwaldActive?: boolean
}
