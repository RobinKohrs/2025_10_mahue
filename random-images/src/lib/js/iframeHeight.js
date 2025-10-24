/**
 * Utility for automatically sending iframe height updates
 */

import { createViewport } from './viewport.js'

let viewport = null
let resizeObserver = null
let lastHeight = 0

export function initializeIframeHeight() {
	// Only initialize if we're in an iframe
	if (window.parent === window) return

	viewport = createViewport('main')
	viewport.initialize()

	// Set up ResizeObserver to watch for content changes
	if (typeof ResizeObserver !== 'undefined') {
		resizeObserver = new ResizeObserver(entries => {
			updateHeight()
		})

		// Observe the body for height changes
		resizeObserver.observe(document.body)
	}

	// Also listen for window resize
	window.addEventListener('resize', updateHeight)

	// Initial height update
	updateHeight()
}

export function updateHeight() {
	if (!viewport) return

	const height = Math.max(
		document.body.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.clientHeight,
		document.documentElement.scrollHeight,
		document.documentElement.offsetHeight
	)

	// Only send update if height changed significantly (avoid spam)
	if (Math.abs(height - lastHeight) > 5) {
		lastHeight = height
		viewport.sendHeight(height)
	}
}

export function cleanup() {
	if (resizeObserver) {
		resizeObserver.disconnect()
	}
	window.removeEventListener('resize', updateHeight)
}
