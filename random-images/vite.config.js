import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

/*
 * fyi: postcss config is loaded automagically
 */

export default defineConfig({
	plugins: [sveltekit()]

	// certificate to use https in development
	// see: https://stackoverflow.com/a/76525335/6070191 for more
	// server: {
	// 	https: {
	// 		key: fs.readFileSync(`${__dirname}/cert/key.pem`),
	// 		cert: fs.readFileSync(`${__dirname}/cert/cert.pem`)
	// 	},
	// 	proxy: {}
	// }
})
