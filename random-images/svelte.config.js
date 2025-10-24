import adapter from '@sveltejs/adapter-static'

const config = {
	kit: {
		adapter: adapter({
			pages: 'dist'
		}),
		embedded: true,
		files: {
			assets: 'static'
		},
		alias: {
			$charts: 'src/charts',
			$components: 'src/components',
			$logic: 'src/logic',
			$pages: 'src/pages',
			$state: 'src/state',
			$styles: 'src/styles',
			$types: 'src/types',
			$utils: 'src/utils'
		}
	}
}

export default config
