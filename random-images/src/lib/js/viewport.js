/**
 * Simple viewport utility for iframe communication
 * Replaces @derstandard/dj-utils functionality
 */

export function createViewport(id) {
	let isInitialized = false
	let resizeCallback = null

	const viewport = {
		id,
		initialize() {
			if (isInitialized) return
			isInitialized = true
			
			// Send iframe ready message to parent
			if (window.parent !== window) {
				window.parent.postMessage({
					eventName: 'dst.dom.iframeReady',
					payload: { viewportId: id }
				}, '*')
			}
		},
		
		resize() {
			if (resizeCallback) {
				resizeCallback()
			}
		},
		
		onResize(callback) {
			resizeCallback = callback
		},
		
		sendHeight(height) {
			if (window.parent !== window) {
				window.parent.postMessage({
					eventName: 'dst.dom.resizeIframe',
					payload: { 
						contentHeight: height,
						viewportId: id 
					}
				}, '*')
			}
		}
	}

	return viewport
}
