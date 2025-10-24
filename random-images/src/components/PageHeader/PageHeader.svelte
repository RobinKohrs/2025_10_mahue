<script>
import { ArrowLeft } from 'phosphor-svelte'
import Button from '$components/Button/Button.svelte'
import appState from '$state/appState.svelte.js'

let { children, settings } = $props()
</script>

<header
	class="mb-4 grid w-full grid-cols-[1fr_5fr_1fr] items-center justify-start pt-4">
	<Button onclick={() => appState.send('back')}>
		{#snippet icon(className)}
			<ArrowLeft class={className} />
		{/snippet}
		Zurück
	</Button>
	<h1 class="mx-auto text-2xl font-bold text-primary">
		{@render children?.()}
	</h1>
	<div class="flex justify-end">
		{@render settings?.()}
	</div>
</header>
