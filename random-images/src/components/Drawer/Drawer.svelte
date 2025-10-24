<script>
import { Drawer as D } from 'vaul-svelte'
import { X } from 'phosphor-svelte'
import ButtonIcon from '$components/ButtonIcon/ButtonIcon.svelte'

/**
 * @typedef {Object} DrawerProps
 * @prop {Boolean} open
 * @prop {import('svelte').Snippet} [header]
 * @prop {import('svelte').Snippet} children
 * @prop {() => void} [onclose]
 */

/** @type {DrawerProps} */
let { open = $bindable(false), header, children, onclose } = $props()
</script>

<D.Root bind:open onClose={onclose} shouldScaleBackground closeThreshold={0.9}>
	<D.Content
		class="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[90%] flex-col rounded-t-xl bg-white">
		<D.Close class="absolute right-3 top-3 z-50">
			{#snippet child({ props })}
				<ButtonIcon {...props}>
					{#snippet icon(size)}
						<X {size} />
					{/snippet}
				</ButtonIcon>
			{/snippet}
		</D.Close>
		<div
			class="bg-secondary/40 mx-auto my-4 h-1 w-[80px] shrink-0 rounded-full">
		</div>

		{#if typeof header === 'function'}
			<div class="mb-2 mt-1">
				{@render header?.()}
			</div>
		{/if}

		<div class="relative w-full overflow-y-scroll">
			<div
				class="sticky top-0 z-50 mx-4 h-4 shrink-0 bg-gradient-to-b from-white to-transparent">
				&nbsp;
			</div>
			{@render children?.()}
		</div>
	</D.Content>
	<D.Overlay class="fixed inset-0 bg-[#D7E2E8]/80 backdrop-blur-sm" />
</D.Root>
