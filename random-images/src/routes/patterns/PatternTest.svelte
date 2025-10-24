<script lang="ts">
import { SvelteSet } from 'svelte/reactivity'
import { shuffle } from 'd3-array'
import { dev } from '$app/environment'
import {
	alleGebiet,
	bundGebietsart,
	landGebietsart
} from '$components/Filters/GebietKombi.svelte'
import { getAlleJahr as getAlleJahre } from '$components/Filters/Jahr.svelte'
import { getAllePartei, getGroßPartei } from '$components/Filters/Partei.svelte'
import {
	allePostenArt,
	ausgabenPostenArt,
	einAusPostenArt,
	einnahmenPostenArt,
	getAllePosten,
	getAusgaben,
	getEinnahmen
} from '$components/Filters/Posten.svelte'
import BlockVisualiser from '$components/MockPlot/BlockVisualiser.svelte'
import MockPlot from '$components/MockPlot/MockPlot.svelte'
import {
	columnOrder,
	expandDecision,
	findDecision,
	type BlockPattern
} from '$logic/deciders/pattern'
import { FilterState } from '$state/filterState.svelte'
import type { RsbData } from '$state/RsbData.svelte'
import { type Block, type BlockName, type Cardinality } from '$types/blocks'
import type { FilterInputState } from '$types/filterState'
import type { Gebiet } from '$types/rsbData'

interface PatternTestProps {
	rsb: RsbData
	blockPattern: BlockPattern
}

let { rsb, blockPattern }: PatternTestProps = $props()

// generate a (randomized) cardinality instance based on the given pattern
const generatedCardinalities = $derived(
		generatePatternInstance(blockPattern.pattern)
	),
	generatedBlocks: Block[] = columnOrder.map((col, j) => [
		col,
		generatedCardinalities[j]
	])

// generate filterState based on generated cardinalities
const filterState = $derived.by(() => {
	if (dev) console.info('Generating filterState from pattern')

	const card = Object.fromEntries(generatedBlocks) as Record<
		BlockName,
		Cardinality
	>
	const filterInput = generateSelected(card)
	return new FilterState(filterInput)
})

// expand fOrAs in given pattern based on generated cardinalites
const inputDecision = blockPattern.decision.map((dec, j) =>
	expandDecision(dec, generatedCardinalities[j])
)
// find (expanded) decision for derived filterState (which is also based on the generated cardinalities)
const filterDecision = $derived(
	findDecision(Object.values(filterState.inputs).map(v => v.filter))
)
const decisionsEqual = $derived(
	filterDecision?.decision.every((d, j) => d === inputDecision[j])
)

function generatePatternInstance(pattern: RegExp) {
	const instance = `${pattern}`
		.replaceAll('/', '')
		.replaceAll('-', '')
		.replaceAll(')(?:', ';')
		.replaceAll('?)', ';')
		.replaceAll('(?:', ';')
		.replaceAll('?|', '|')
		.replaceAll('?;', ';')
		.replaceAll('?', ';')
		.replaceAll(/^;|;$/g, '')
		.split(';')
		.map(p => p.split('|'))
		.map(cardinalities => shuffle(cardinalities)?.[0]) as Cardinality[]

	// enforce rule: postenId === 'ein' -> postenArt = 'ein'
	if (instance[2] === 'ein' && instance[3] !== 'ein') {
		if (dev)
			console.log(
				'PostenId === "ein" but PostenArt !== "ein", setting PostenArt to "ein"'
			)
		instance[3] = 'ein'
	} else if (instance[2] === 'kein') {
		if (dev)
			console.warn(
				'PostenId is "kein", setting PostenArt to "kein" as well'
			)
		instance[3] = 'kein'
	} else if (instance[2] === 'mehrere') {
		instance[3] = 'ein'
	}

	return instance
}

function generateSelected(
	cardinalities: Record<BlockName, Cardinality>
): FilterInputState {
	let selectedJahr = generateSelectedJahr(cardinalities.jahr),
		selectedParteiId = generateSelectedParteiId(cardinalities.parteiId),
		selectedPostenId = generateSelectedPostenId(cardinalities.postenId),
		selectedPostenArt = generateSelectedPostenArt(
			cardinalities.postenArt,
			selectedPostenId
		),
		selectedGebiet = generateSelectedGebiet(cardinalities.gebiet),
		selectedGebietsart = generateSelectedGebietsart(
			cardinalities.gebietsart,
			selectedGebiet
		)

	const filterInput = {
		jahr: {
			filter: cardinalities.jahr,
			selected: selectedJahr
		},
		parteiId: {
			filter: cardinalities.parteiId,
			selected: selectedParteiId
		},
		postenId: {
			filter: cardinalities.postenId,
			selected: selectedPostenId
		},
		postenArt: {
			filter: cardinalities.postenArt,
			selected: selectedPostenArt
		},
		gebiet: {
			filter: cardinalities.gebiet,
			selected: selectedGebiet
		},
		gebietsart: {
			filter: cardinalities.gebietsart,
			selected: selectedGebietsart
		}
	} as FilterInputState
	return filterInput
}

function generateSelectedJahr(cardinality: Cardinality) {
	if (cardinality === 'kein') return new SvelteSet([])
	const alle = getAlleJahre(rsb)
	if (cardinality === 'alle') return alle
	if (cardinality === 'spanne' || cardinality === 'mehrere') {
		const alleArr = alle.values().toArray(),
			index1 = Math.floor(Math.random() * alleArr.length),
			index2 = Math.floor(Math.random() * alleArr.length)

		let start = Math.min(index1, index2),
			end = Math.max(index1, index2)

		if (start === end) {
			if (end < alleArr.length - 1) end++
			else start--
		}
		return new SvelteSet(alleArr.slice(start, end))
	}
	const shuffled = shuffle(alle.values().toArray())
	if (cardinality === 'ein') return new SvelteSet(shuffled.slice(0, 1))

	if (dev) console.error('Unexpected cardinality for jahr:', cardinality)
	return alle
}

function generateSelectedParteiId(cardinality: Cardinality) {
	if (cardinality === 'kein') return new SvelteSet([])
	const alle = getAllePartei(rsb)
	if (cardinality === 'alle') return alle
	if (cardinality === 'mehrere') return getGroßPartei()

	const shuffled = shuffle(alle.values().toArray())
	if (cardinality === 'ein') return new SvelteSet(shuffled.slice(0, 1))

	if (dev) console.error('Unexpected cardinality for parteiId:', cardinality)
	return alle
}

function generateSelectedPostenId(cardinality: Cardinality) {
	if (cardinality === 'kein') return new SvelteSet([])
	const alle = getAllePosten(rsb)
	if (cardinality === 'alle') return alle
	if (cardinality === 'mehrere') {
		const coinflip = Math.random() < 0.5
		if (coinflip) return getEinnahmen(rsb)
		else return getAusgaben(rsb)
	}

	const shuffled = shuffle(alle.values().toArray())
	if (cardinality === 'ein') return new SvelteSet(shuffled.slice(0, 1))

	if (dev) console.error('Unexpected cardinality for postenId:', cardinality)
	return alle
}

function generateSelectedPostenArt(
	cardinality: Cardinality,
	selectedPosten: SvelteSet<string>
) {
	if (cardinality === 'kein') return new SvelteSet([])
	const alle = allePostenArt

	const onlyEin = selectedPosten
		.values()
		.every(p => rsb.postenBeschreibung.get(p)?.postenArt === 'Einnahme')
	const onlyAus = selectedPosten
		.values()
		.every(p => rsb.postenBeschreibung.get(p)?.postenArt === 'Ausgabe')

	if (cardinality === 'ein') {
		if (onlyEin) return einnahmenPostenArt
		else if (onlyAus) return ausgabenPostenArt
		if (selectedPosten.size > 1) {
			if (dev)
				console.log(
					'postenArt cardinality === 1 but selected posten have more than one postenArt, overriding postenArt',
					selectedPosten
				)
			return einAusPostenArt
		}
	}

	if (
		cardinality === 'alle' ||
		cardinality === 'saldo' ||
		cardinality === 'mehrere'
	) {
		if (onlyEin) return einnahmenPostenArt
		else if (onlyAus) return ausgabenPostenArt
		return einAusPostenArt
	}

	if (selectedPosten.size !== getAllePosten(rsb).size) {
		if (dev)
			console.warn(
				'selected posten should contain all Posten, but does not',
				selectedPosten
			)
	}

	if (dev)
		console.error(
			'Unexpected cardinality for postenArt:',
			cardinality,
			selectedPosten,
			'returning alle'
		)
	return alle
}

function generateSelectedGebiet(cardinality: Cardinality) {
	if (cardinality === 'kein') return new SvelteSet([])
	const alle = alleGebiet(rsb)
	if (cardinality === 'alle' || cardinality === 'mehrere') return alle

	const shuffled = shuffle(alle.values().toArray())
	if (cardinality === 'ein') return new SvelteSet(shuffled.slice(0, 1))

	if (dev) console.error('Unexpected cardinality for gebiet:', cardinality)
	return alle
}

function generateSelectedGebietsart(
	cardinality: Cardinality,
	selectedGebiet: SvelteSet<Gebiet>
) {
	if (cardinality === 'kein') return new SvelteSet([])
	if (selectedGebiet.size === 1 && selectedGebiet.has('Österreich')) {
		if (cardinality !== 'ein')
			if (dev)
				console.log(
					'selected Gebiet is "Österreich", overriding gebietsart to "Bund"'
				)
		return bundGebietsart
	}
	if (!selectedGebiet.has('Österreich')) {
		if (selectedGebiet.size !== 9)
			if (dev)
				console.log(
					"selected gebiet schould contain all Bundesländer, but doesn't",
					selectedGebiet
				)
		return landGebietsart
	} else if (selectedGebiet.size === 10) return landGebietsart

	if (dev)
		console.error(
			'Unexpected cardinality for gebietsart:',
			cardinality,
			selectedGebiet
		)
	return landGebietsart
}
</script>

<h2>Pattern "{blockPattern.id}"</h2>
<BlockVisualiser blocks={generatedBlocks} {filterState} />
<!-- <div>{blockDecision.pattern}</div> -->
<!-- <div>{cardinalities.join(', ')}</div> -->

<section>
	<details>
		<summary>Filter state</summary>
		<div
			class="grid grid-cols-[min-content_min-content_auto] gap-x-2 overflow-hidden">
			{#each Object.entries(filterState.inputs) as [col, { filter, selected }]}
				<div>{col}</div>
				<div>{filter}</div>
				<div>{selected.values().toArray().join(' | ')}</div>
			{/each}
		</div>
	</details>
</section>

{#if !decisionsEqual}
	<section>
		<h3>Decisions not equal</h3>
		<span
			>Pattern "{filterDecision?.id}" statt Pattern "{blockPattern.id}"</span>
		<div class="grid grid-cols-7 grid-rows-2">
			Input:
			{#each inputDecision as dec}
				<div>{dec}</div>
			{/each}
			Filter:
			{#each filterDecision?.decision ?? [] as dec}
				<div>{dec}</div>
			{/each}
		</div>
		<!-- <div>{decisionsEqual}</div> -->
	</section>
{/if}

<svelte:boundary>
	{#if filterState}
		<MockPlot />
	{/if}
</svelte:boundary>

<style>
section {
	@apply rounded-lg border border-border bg-white p-2;
}

h2 {
	@apply text-lg font-semibold text-primary;
}

h3 {
	@apply text-base font-semibold text-primary;
}

summary {
	@apply cursor-pointer font-semibold text-primary;
}
</style>
