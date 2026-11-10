<template>
	<ActionButtons :auto-focus="autoFocus" />
	<p v-if="features.length > 1" class="kern-subline kern-subline--small">
		{{
			$t(($) => $.switch.entryXOfY, {
				ns: 'gfi',
				index: featureIndex + 1,
				count: features.length,
			})
		}}
	</p>
	<section class="kern-card__body">
		<h2 class="kern-title">
			{{ `${properties.str} ${properties.hsnr}` }}
		</h2>
		<img
			v-if="displayImage"
			:src="properties.pic"
			:alt="$t(($) => $.imageAlt, { ns: 'gfi' })"
			class="meldemichel-gfi-img"
			draggable="false"
			@load="resize"
		/>
		<table class="kern-table">
			<tbody class="kern-table__body">
				<tr v-for="item in infoFields" :key="item" class="kern-table__row">
					<td class="kern-table__cell meldemichel-fat-cell">
						{{ $t(($) => $.properties[item], { ns: 'gfi' }) }}
					</td>
					<td class="kern-table__cell">
						{{ $t(formatProperty(item, properties[item]) as SelectorKey) }}
					</td>
				</tr>
			</tbody>
		</table>
	</section>
	<section class="kern-card__body">
		<h2 class="kern-title">
			{{ $t(($) => $.properties.beschr, { ns: 'gfi' }) }}
		</h2>
		<p class="kern-body kern-body-small meldemichel-breaking">
			{{ properties.beschr }}
		</p>
	</section>
	<section class="kern-card__body">
		<h2 class="kern-title">
			{{ $t(($) => $.properties.rueck, { ns: 'gfi' }) }}
		</h2>
		<p class="kern-body kern-body-small meldemichel-breaking">
			{{ properties.rueck }}
		</p>
	</section>
</template>

<script setup lang="ts">
import type { SelectorKey } from 'i18next'

import { useGfiStore } from '@polar/polar/plugins/gfi/store'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import ActionButtons from './ActionButtons.vue'

defineProps<{
	autoFocus: boolean
}>()

const infoFields = ['skat', 'start', 'statu'] as const

const gfiStore = useGfiStore()
const { featureIndex, features, properties } = storeToRefs(gfiStore)

const imageLoaded = ref(false)
const displayImage = computed(() => {
	return Boolean(gfiStore.properties.pic)
})

function resize(e: Event) {
	if ((e.currentTarget as HTMLImageElement).complete && !imageLoaded.value) {
		imageLoaded.value = true
		window.dispatchEvent(new Event('resize'))
	}
}

function formatProperty(type: (typeof infoFields)[number], value: string) {
	if (!value) {
		return ''
	}
	if (type === 'skat') {
		return `external-meldemichel:skat.${value}`
	}
	if (type === 'start') {
		return `${value.substring(6, 8)}.${value.substring(
			4,
			6
		)}.${value.substring(0, 4)}`
	}
	return `gfi:status.${value}`
}
</script>

<style scoped>
* {
	color: oklch(
		var(--brand-color-l) var(--brand-color-c) var(--brand-color-h)
	) !important;
}

.action-bar {
	width: 100%;
	display: flex;
	justify-content: space-between;

	.action-bar-group {
		display: flex;
		gap: var(--kern-metric-space-small);
	}
}

td {
	white-space: normal;
	max-width: calc(2 * var(--kern-metric-dimension-5x-large));
	overflow-wrap: break-word;
	word-break: normal;
}

.kern-subline {
	padding: 0;
}

.kern-title {
	margin-top: var(--kern-metric-space-small);
	padding-top: 0;
	word-break: normal;
	overflow-wrap: anywhere;
}

.meldemichel-fat-cell {
	font-weight: bolder;
	white-space: nowrap;
}

.meldemichel-gfi-img {
	display: block;
	max-width: 100%;
	margin: 0 auto;
}
/* Fixes the issue of the content mega-evolving */
.meldemichel-breaking {
	width: 0;
	min-width: 100%;
	text-wrap: wrap;
	overflow-wrap: break-word;
	word-break: normal;
}
</style>
