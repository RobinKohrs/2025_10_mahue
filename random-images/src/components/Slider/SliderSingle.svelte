<script lang="ts">
import { Slider } from 'bits-ui'

let {
	min,
	max,
	value = $bindable(),
	labels,
	onvaluecommit
}: {
	min: number
	max: number
	value: number
	labels?: number[]
	onvaluecommit: (value: number) => void
} = $props()
</script>

<div class="mb-10 w-full">
	<Slider.Root
		step={1}
		{min}
		{max}
		type="single"
		bind:value
		class="relative flex w-full touch-none select-none items-center"
		trackPadding={2}
		onValueCommit={onvaluecommit}>
		{#snippet children({ tickItems })}
			<span
				class="relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full bg-secondary">
				<Slider.Range class="absolute h-full bg-primary" />
			</span>

			{#each tickItems as { index, value } (index)}
				<!-- <Slider.Tick {index} class="z-1 h-2 w-[1px] bg-secondary/50" /> -->
				{#if !labels || labels.includes(value)}
					<Slider.TickLabel
						{index}
						class="data-bounded:text-primary mt-4 text-sm leading-none"
						position="bottom">
						{value}
					</Slider.TickLabel>
				{/if}
			{/each}
			<Slider.Thumb
				index={0}
				class="focus-visible:ring-foreground data-active:border-secondary z-5 focus-visible:outline-hidden data-active:scale-[0.98] block size-[25px] cursor-pointer rounded-full border-2 border-white bg-primary shadow-lg transition-colors hover:border-secondary focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
		{/snippet}
	</Slider.Root>
</div>
