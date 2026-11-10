<template>
	<PolarCard id="polar-card-gfi">
		<GfiFeature v-if="feature" :auto-focus="mounted" />
		<GfiFeatureList v-else />
	</PolarCard>
</template>

<script setup lang="ts">
// NOTE: This file is based on a copy of GfiUI.vue from @polar/polar
import PolarCard from '@polar/polar/components/PolarCard'
import { useGfiStore } from '@polar/polar/plugins/gfi/store'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

import GfiFeature from './GfiFeature.vue'
import GfiFeatureList from './GfiFeatureList.vue'

/*
 * Only becomes true after the initial render.
 * Needed, so the first button of GfiFeature is only focused when navigating
 * inside the plugin and not closing & opening the window.
 */
const mounted = ref(false)

onMounted(() => {
	mounted.value = true
})

const { feature } = storeToRefs(useGfiStore())
</script>

<style scoped>
#polar-card-gfi {
	z-index: 1;
}
</style>
