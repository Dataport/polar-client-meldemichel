/**
 * Imitates what happens on re-navigation in an SPA:
 * The page section with the id `polar-page` is torn down completely and
 * rebuilt from its initial markup.
 * This will only work in production mode.
 *
 * Removed maps are registered for finalisation, so a console message shows
 * once the browser has garbage collected them.
 *
 * @param {function} setup Creates the map. May return a clean-up function that
 * removes all subscriptions and references to the map, like a router would on
 * leaving the page.
 */
export const makeSimulateRecreate = async (setup) => {
	const page = document.getElementById('polar-page')
	const initialMarkup = page.innerHTML
	const rerenderButton = document.getElementById('rerender')
	const registry = new FinalizationRegistry((count) => {
		// eslint-disable-next-line no-console
		console.info(`Map #${count} has been garbage collected.`)
	})
	let count = 1
	let cleanup = await setup()

	return () => {
		if (rerenderButton) {
			rerenderButton.disabled = true
		}

		cleanup?.()
		cleanup = null

		const map = page.querySelector('polar-map')
		if (map) {
			registry.register(map, count)
			// eslint-disable-next-line no-console
			console.info(`Map #${count} removed, waiting for garbage collection.`)
		}
		page.replaceChildren()

		setTimeout(async () => {
			page.innerHTML = initialMarkup
			count += 1
			cleanup = await setup()
			if (rerenderButton) {
				rerenderButton.disabled = false
			}
		}, 1000)
	}
}
