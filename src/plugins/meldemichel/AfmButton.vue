<template>
	<!-- TODO: PolarTooltip may have to be updated so tooltips can be set on top as well (smallWidth) -->
	<!-- 		:left="!hasSmallWidth"; :top="hasSmallWidth" -->
	<PolarTooltip
		:hint="$t(($) => $.afmButton.hint, { ns: 'external-meldemichel' })"
		tooltip-position="left"
	>
		<a
			v-if="afmUrl"
			class="kern-btn kern-btn--primary"
			:href="mapStateReady ? afmUrl : '#'"
			:target="mapStateReady ? '_blank' : ''"
			@click="click"
			@keydown.space="click"
		>
			<span class="kern-icon kern-icon--add-location-alt" aria-hidden="true" />
			<span class="kern-label">
				{{ $t(($) => $.afmButton.buttonText, { ns: 'external-meldemichel' }) }}
			</span>
		</a>
	</PolarTooltip>
</template>

<script lang="ts" setup>
import type { MeldemichelPluginOptions } from './types.ts'

import PolarTooltip from '@polar/polar/components/PolarTooltip'
import { notifyUser } from '@polar/polar/lib/notifyUser'
import { useCoreStore } from '@polar/polar/store'
import { t } from 'i18next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useMeldemichelStore } from './store'

const coreStore = useCoreStore()
const { configuration } = storeToRefs(coreStore)

const meldemichelStore = useMeldemichelStore()

const afmUrl = computed(() => {
	const url = (
		configuration.value['external-meldemichel'] as MeldemichelPluginOptions
	).afmUrl
	if (!url) {
		console.error(
			"@polar/client-meldemichel: Missing afmUrl parameter in `configuration['external-meldemichel'].afmUrl`."
		)
		return ''
	}
	return `${url}?${Object.entries(meldemichelStore.mapState)
		.map(([key, value]) => `${key}=${value}`)
		.join('&')}&charset=utf-8`
})

const mapStateReady = computed(() => {
	return !Object.values(meldemichelStore.mapState).includes(
		undefined
	) satisfies boolean
})

function click() {
	if (!mapStateReady.value) {
		notifyUser(
			'info',
			t(($) => $.afmButton.missingAddress, { ns: 'external-meldemichel' }),
			{
				timeout: 10000,
			}
		)
	}
}
</script>
