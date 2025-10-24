<script lang="ts">
import { patterns } from '$logic/deciders/pattern'
import { onMount } from 'svelte'
import PatternTest from './PatternTest.svelte'
import { RsbData } from '$state/RsbData.svelte'

let rsb: RsbData | undefined = $state()

onMount(async () => {
	const { resultFlat, beschreibungPosten } = await import(
		'$state/rsb.svelte.ts'
	)

	rsb = new RsbData(resultFlat, beschreibungPosten)
})
</script>

<main>
	<h1>Pattern Tests</h1>

	{#if rsb}
		<section class="flex flex-col gap-2">
			{#each patterns as blockPattern}
				<PatternTest {blockPattern} {rsb} />
			{/each}
		</section>
	{/if}
</main>

<style>
main {
	@apply pt-4;
}

h1 {
	@apply text-primary text-2xl font-semibold;
}
</style>
