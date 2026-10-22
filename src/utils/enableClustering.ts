import type { MasterportalApiServiceRegister } from '@polar/polar'

export const enableClustering = (
	register: MasterportalApiServiceRegister,
	reportServiceId: string | undefined
) => {
	if (reportServiceId) {
		const reportServiceConfiguration = register.find(
			(entry) => entry.id === reportServiceId
		)
		if (!reportServiceConfiguration) {
			console.error(
				`@polar/client-meldemichel: Report service ${reportServiceId} could not be found in service register. Clustering has not been activated.`
			)
			return register
		}

		/*
		 * must be in services.json at start-up;
		 * added on the fly since HH services.json is used and can't be edited.
		 */
		reportServiceConfiguration.clusterDistance = 40
	}
	return register
}
