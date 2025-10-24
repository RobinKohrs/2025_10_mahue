<script lang="ts">
import type { HTMLDivAttributes } from 'svelte/elements'

let {
	show = false,
	onClose = undefined,
	children,
	...props
}: HTMLDivAttributes & {
	show?: boolean
	onClose?: () => void
	children?: any
} = $props()

let overlayElement: HTMLDivElement = $state()

$effect(() => {
	if (show) {
		function handleClick(event: MouseEvent) {
			if (
				overlayElement &&
				!overlayElement.contains(event.target as Node)
			) {
				onClose?.()
			}
		}

		// Small delay to prevent immediate closing
		setTimeout(() => {
			document.addEventListener('click', handleClick)
		}, 10)

		return () => {
			document.removeEventListener('click', handleClick)
		}
	}
})
</script>

{#if show}
	<div bind:this={overlayElement} {...props}>
		{@render children?.()}
	</div>
{/if}
