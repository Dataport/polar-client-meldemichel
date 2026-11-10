<template>
	<div ref="actionBar" class="action-bar">
		<div class="action-bar-group">
			<KernButton
				v-if="features.length > 1"
				class="kern-btn--tertiary"
				icon="kern-icon--arrow-back"
				:label-sr-only="true"
				@click="
					featureIndex =
						featureIndex > 0 ? featureIndex - 1 : features.length - 1
				"
			>
				{{ $t(($) => $.switch.previous, { ns: 'gfi' }) }}
			</KernButton>
			<KernButton
				v-if="features.length > 1"
				class="kern-btn--tertiary"
				icon="kern-icon--arrow-forward"
				:label-sr-only="true"
				@click="
					featureIndex =
						featureIndex + 1 < features.length ? featureIndex + 1 : 0
				"
			>
				{{ $t(($) => $.switch.next, { ns: 'gfi' }) }}
			</KernButton>
		</div>
		<div class="action-bar-group">
			<KernButton
				class="kern-btn--tertiary"
				icon="kern-icon--keyboard-double-arrow-right"
				:label-sr-only="true"
				@click="closeGfi()"
			>
				{{ $t(($) => $.close, { ns: 'gfi' }) }}
			</KernButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import KernButton from '@polar/polar/components/kern/KernButton'
import { useGfiStore } from '@polar/polar/plugins/gfi/store'
import { storeToRefs } from 'pinia'
import { onMounted, useTemplateRef } from 'vue'

const props = defineProps<{
	autoFocus: boolean
}>()

const gfiStore = useGfiStore()
const { featureIndex, features } = storeToRefs(gfiStore)

const actionBar = useTemplateRef<HTMLDivElement>('actionBar')

onMounted(() => {
	if (props.autoFocus) {
		actionBar.value?.querySelector('button')?.focus()
	}
})

function closeGfi() {
	gfiStore.featureInformation = {}
	gfiStore.feature = null
}
</script>

<style scoped>
.action-bar {
	width: 100%;
	display: flex;
	justify-content: space-between;

	.action-bar-group {
		display: flex;
		gap: var(--kern-metric-space-small);

		/* KERN shows its focus outline on `:focus` but we only want it for keyboard navigation. */
		.kern-btn:focus:not(:focus-visible) {
			outline: none;
		}
	}
}
</style>
