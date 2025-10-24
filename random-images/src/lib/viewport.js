// Simple viewport utility for iframe communication
// Based on @derstandard/dj-utils/dst but without tracking dependencies

function debounce(func, wait) {
	let timeout
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout)
			func(...args)
		}
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
	}
}

export function createViewport(name = `viewport-${Date.now()}`) {
	const viewport = {
		state: {
			id: name,
			connected: false,
			debug: false,
			lastPayload: {
				height: 0
			},
			width: null,
			height: null,
			scrollPosition: null,
			visible: true
		},
		debugLog(message, e = null) {
			if (this.state.debug && e !== null)
				console.log(this.state.id, message, e)
			else if (this.state.debug) console.log(this.state.id, message)
		},
		debugMode() {
			console.log('VIEWPORT running in debug mode')
			this.state.debug = true
		},
		handler(e) {
			if (
				e.data.eventName !== 'dst.dom.updateParentParams' &&
				e.data.eventName !== 'dst.dom.parentScroll'
			)
				return
			this.debugLog('VIEWPORT handler triggered with:', e)
			this.updateState(e)
			if (e.data.eventName === 'dst.dom.updateParentParams') this.resize()
		},
		initialize(mode = 'silent') {
			if (mode === 'debug') this.debugMode()
			this.debugLog(this)
			window.parent.postMessage(
				{
					eventName: 'dst.dom.iframeReady',
					payload: {
						viewportId: this.state.id
					}
				},
				'*'
			)
			window.addEventListener('message', e => {
				this.handler(e)
			})
			window.addEventListener('visibilitychange', () => {
				if (document.visibilityState === 'hidden')
					this.setVisible(false)
				else this.setVisible(true)
			})
			return this
		},
		resizeInternal() {
			if (document.body.offsetHeight === this.state.lastPayload.height) {
				// Don't send a message if height has not changed
				this.debugLog('VIEWPORT resize triggered: no height change')
				return
			}
			this.debugLog(
				'VIEWPORT resize triggered: new height (' +
					document.body.offsetHeight +
					'px)'
			)
			this.state.lastPayload.height = document.body.offsetHeight
			window.parent.postMessage(
				{
					eventName: 'dst.dom.resizeIframe',
					payload: {
						viewportId: this.state.id,
						contentHeight: document.body.offsetHeight
					}
				},
				'*'
			)
		},
		setVisible(bool) {
			this.debugLog('VIEWPORT visible changed to', bool)
			this.state.visible = bool
		},
		updateState(e) {
			this.state.connected = true
			if (e.data) {
				this.state.width = e.data.payload.windowWidth
				this.state.height = e.data.payload.windowHeight
				this.state.scrollPosition = e.data.payload.scrollPosition
			}
		}
	}
	viewport.resize = debounce(viewport.resizeInternal.bind(viewport), 50)
	return viewport
}
