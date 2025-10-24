import tailwindcssAnimate from 'tailwindcss-animate'
import createPlugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground:
						'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground:
						'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground':
						'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground':
						'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				xl: 'calc(var(--radius) + 4px)',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			// Textblockbreite auf derstandard.at
			maxWidth: { dst: '615px' },
			stroke: { current: 'currentColor' },
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--bits-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--bits-accordion-content-height)' },
					to: { height: '0' }
				},
				'caret-blink': {
					'0%,70%,100%': { opacity: '1' },
					'20%,50%': { opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'caret-blink': 'caret-blink 1.25s ease-out infinite'
			}
		},
		fontFamily: {
			sans: [
				'var(--font-info)',
				'"Apple Color Emoji"',
				'"Segoe UI Emoji"',
				'"Segoe UI Symbol"',
				'"Noto Color Emoji"'
			],
			serif: 'var(--font-text)',
			mono: [
				'Menlo',
				'Monaco',
				'Consolas',
				'"Liberation Mono"',
				'"Courier New"',
				'monospace'
			],
			'matilda-info': 'var(--font-info)',
			'matilda-text': 'var(--font-text)',
			'matilda-title': 'var(--font-title)',
			'matilda-grande': 'var(--font-grande)',
			'matilda-brand': 'var(--font-brand)'
		}
	},
	plugins: [
		tailwindcssAnimate,
		// remove webkit input[type="search"] decorations
		createPlugin(({ addBase }) => {
			addBase({
				'[type="search"]::-webkit-search-decoration': {
					display: 'none'
				},
				'[type="search"]::-webkit-search-cancel-button': {
					display: 'none'
				},
				'[type="search"]::-webkit-search-results-button': {
					display: 'none'
				},
				'[type="search"]::-webkit-search-results-decoration': {
					display: 'none'
				}
			})
		}),

		createPlugin(
			({ matchUtilities, theme }) => {
				// user has to set --text-stroke-color themselves in their project
				matchUtilities(
					{
						'dst-text-stroke': thickness => ({
							/* upper left, upper, upper right, right, 
							lower, right, lower, lower left, left */
							textShadow:
								`-${thickness}px -${thickness}px 0 var(--text-stroke-color),` +
								`0 -${thickness}px 0 var(--text-stroke-color),` +
								`${thickness}px -${thickness}px 0 var(--text-stroke-color),` +
								`${thickness}px 0 0 var(--text-stroke-color),` +
								`${thickness}px ${thickness}px 0 var(--text-stroke-color),` +
								`0 ${thickness}px 0 var(--text-stroke-color),` +
								`-${thickness}px ${thickness}px 0 var(--text-stroke-color),` +
								`${thickness}px 0 0 var(--text-stroke-color)` +
								';'
						})
					},
					{ values: theme('textStroke') }
				)
			},
			{
				theme: {
					textStroke: {
						0.5: '0.5',
						1: '1',
						1.5: '1.5'
						// 2: '2'
					}
				}
			}
		)
	]
}

export default config
