import { innerWidth } from 'svelte/reactivity/window'

// extracted this later to a variable exported from
// a .svelte.js file instead of using context

// Handle screen sizes
// values taken from tailwind.config.js
const isExtraWide = (width: number) => width > 1024,
	isWide = (width: number) => width > 900,
	isDesktop = (width: number) => width > 614,
	// const isTablet = width => width > 550
	isMobile = (width: number) => width > 350,
	isSmall = (width: number) => width <= 349

const xl = $derived(
		innerWidth?.current ? isExtraWide(innerWidth.current) : false
	),
	wd = $derived(innerWidth?.current ? isWide(innerWidth.current) : false),
	dt = $derived(innerWidth?.current ? isDesktop(innerWidth.current) : true),
	mb = $derived(innerWidth?.current ? isMobile(innerWidth.current) : true),
	xs = $derived(innerWidth?.current ? isSmall(innerWidth.current) : false)

const breakpoints = {
	// using getters is needed to work around this warning:
	// "State referenced in its own scope will never update. Did you mean to reference it inside a closure?"
	get xl() {
		return xl
	},
	get wd() {
		return wd
	},
	get dt() {
		return dt
	},
	get mb() {
		return mb
	},
	get xs() {
		return xs
	},
	get screenWidth() {
		return innerWidth.current
	},
	isDesktop
}

export { breakpoints }
