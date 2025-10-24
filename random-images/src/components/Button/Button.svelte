<script module lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { ClassValue, HTMLButtonAttributes } from 'svelte/elements'

const buttonVariants = tv({
	slots: {
		button: 'inline-flex touch-manipulation items-center justify-center whitespace-nowrap font-sans font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
		icon: '',
		children: ''
	},
	variants: {
		color: {
			primary: {
				button: 'bg-primary text-foreground-primary hover:bg-primary/70 focus-visible:bg-primary-70'
			},
			secondary: {
				button: 'bg-secondary/30 text-foreground-secondary hover:bg-secondary/60 focus-visible:bg-secondary/60'
			},
			ghost: {
				button: 'border border-border text-primary hover:bg-secondary/20 focus-visible:bg-secondary/20'
			}
		},
		size: {
			xs: {
				button: 'px-1.5 py-1 rounded-sm',
				icon: 'size-[16px]'
			},
			sm: {
				button: 'px-2 py-1.5 rounded-md',
				icon: '18px'
			},
			base: {
				button: 'px-2.5 py-2 rounded-md',
				icon: 'size-[18px]'
			},
			lg: {
				button: 'px-3 py-2.5 rounded-md',
				icon: '20px'
			},
			xl: {
				button: 'px-3 py-2.5 rounded-lg',
				icon: '24px'
			}
		},
		icon: {
			true: { icon: '' }
		},
		hideLabel: {
			true: ''
		},
		alignIcon: {
			left: '',
			right: ''
		},
		disabled: {
			true: {
				button: 'opacity-50 cursor-not-allowed'
			}
		}
	},
	compoundVariants: [
		{
			hideLabel: true,
			icon: true,
			class: { icon: 'mx-0' }
		},
		// reduce padding on side of the icon
		{
			size: 'xs',
			hideLabel: false,
			icon: true,
			alignIcon: 'left',
			class: { button: 'pl-1', icon: 'mr-1' }
		},
		{
			size: 'xs',
			hideLabel: false,
			icon: true,
			alignIcon: 'right',
			class: { button: 'pr-1', icon: 'ml-1' }
		},
		{
			size: 'sm',
			hideLabel: false,
			icon: true,
			alignIcon: 'left',
			class: { button: 'pl-1.5', icon: 'mr-1' }
		},
		{
			size: 'sm',
			hideLabel: false,
			icon: true,
			alignIcon: 'right',
			class: { button: 'pr-1.5', icon: 'ml-1' }
		},
		{
			size: 'base',
			hideLabel: false,
			icon: true,
			alignIcon: 'left',
			class: { button: 'pl-2', icon: 'mr-1' }
		},
		{
			size: 'base',
			hideLabel: false,
			icon: true,
			alignIcon: 'right',
			class: { button: 'pr-2', icon: 'ml-1' }
		},
		{
			size: 'lg',
			hideLabel: false,
			icon: true,
			alignIcon: 'left',
			class: { button: 'pl-2.5', icon: 'mr-1' }
		},
		{
			size: 'lg',
			hideLabel: false,
			icon: true,
			alignIcon: 'right',
			class: { button: 'pr-2.5', icon: 'ml-1' }
		},
		{
			size: 'xl',
			hideLabel: false,
			icon: true,
			alignIcon: 'left',
			class: { button: 'pl-2.5', icon: 'mr-1' }
		},
		{
			size: 'xl',
			hideLabel: false,
			icon: true,
			alignIcon: 'right',
			class: { button: 'pr-2.5', icon: 'ml-1' }
		}
	],
	defaultVariants: {
		color: 'secondary',
		size: 'base'
	}
})

type ButtonColor = VariantProps<typeof buttonVariants>['color']
type ButtonSize = VariantProps<typeof buttonVariants>['size']

interface ButtonProps extends HTMLButtonAttributes {
	color?: ButtonColor
	size?: ButtonSize
	alignIcon?: 'left' | 'right'
	hideLabel?: boolean
	disabled?: boolean
	class?: ClassValue
	onclick?: import('svelte/elements').MouseEventHandler<HTMLButtonElement>
	icon?: import('svelte').Snippet<[string]>
	children?: import('svelte').Snippet
}
</script>

<script lang="ts">
import { Button as B } from 'bits-ui'

let {
	color = 'secondary',
	size = 'base',
	alignIcon = 'left',
	hideLabel = false,
	disabled = false,
	class: className = undefined,
	onclick,
	icon,
	children,
	...restProps
}: ButtonProps = $props()

const { button: buttonClass, icon: iconClass } = $derived(
	buttonVariants({
		color,
		size,
		alignIcon,
		hideLabel,
		disabled,
		icon: typeof icon === 'function'
	})
)
</script>

<B.Root class={[buttonClass(), className]} {onclick} {...restProps}>
	{#if alignIcon === 'left' && typeof icon === 'function'}
		{@render icon(iconClass())}
	{/if}
	{#if !hideLabel && typeof children === 'function'}
		{@render children()}
	{/if}
	{#if alignIcon === 'right' && typeof icon === 'function'}
		{@render icon(iconClass())}
	{/if}
</B.Root>
