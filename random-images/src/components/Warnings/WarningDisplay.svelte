<script lang="ts">
import { formatYearRanges } from '$utils/format'

let {
	gueltigkeitWarningDetails = null,
	missingDataWarningDetails = null,
	partyValidityInfo = {
		showNoData: false,
		showWarning: false,
		details: {}
	},
	showRangeWarning = false,
	showAlleJahreBundeslandWarning = false
} = $props<{
	gueltigkeitWarningDetails?: {
		postenName: string
		invalidYears: number[]
	} | null
	missingDataWarningDetails?: {
		postenName: string
		details: {
			party: string
			years: number[]
		}[]
	} | null
	partyValidityInfo?: {
		showNoData: boolean
		showWarning: boolean
		details: {
			invalidParties?: {
				name: string
				start?: number
				end?: number
			}[]
			yearStart?: number
			yearEnd?: number
		}
	}
	showRangeWarning?: boolean
	showAlleJahreBundeslandWarning?: boolean
}>()

const yearText = $derived.by(() => {
	if (
		partyValidityInfo.details.yearStart &&
		partyValidityInfo.details.yearEnd
	) {
		if (
			partyValidityInfo.details.yearStart ===
			partyValidityInfo.details.yearEnd
		) {
			return `im Jahr ${partyValidityInfo.details.yearStart}`
		}
		return `von ${partyValidityInfo.details.yearStart} bis ${partyValidityInfo.details.yearEnd}`
	}
	return 'für den gesamten Zeitraum'
})

// Helper to format party existence details
const formattedParties = $derived.by(() => {
	if (!partyValidityInfo?.details?.invalidParties) return ''

	return partyValidityInfo.details.invalidParties
		.map((p, index) => {
			if (!p.start || !p.end) return p.name

			const isFirst = index === 0
			let rangeText = ''

			if (isFirst) {
				if (p.end >= 2023) {
					rangeText = `im Nationalrat seit ${p.start}`
				} else if (p.start === p.end) {
					rangeText = `im Nationalrat nur ${p.start}`
				} else {
					rangeText = `im Nationalrat von ${p.start} bis ${p.end}`
				}
			} else {
				// Subsequent parties
				if (p.end >= 2023) {
					rangeText = `seit ${p.start}`
				} else if (p.start === p.end) {
					rangeText = `nur ${p.start}`
				} else {
					rangeText = `${p.start} bis ${p.end}`
				}
			}
			return `${p.name} (${rangeText})`
		})
		.join(', ')
})
</script>

{#if showRangeWarning || showAlleJahreBundeslandWarning || gueltigkeitWarningDetails || partyValidityInfo.showWarning || missingDataWarningDetails}
	<div
		class="border-rsb-warning bg-rsb-warning-light mx-2 my-2 flex flex-col items-start justify-start gap-y-1.5 rounded-lg border px-2.5 py-1.5">
		{#if gueltigkeitWarningDetails}
			<div class="text-rsb-warning-text text-sm">
				<span class="font-semibold">Hinweis:</span> Der Posten "{gueltigkeitWarningDetails.postenName}"
				war in
				{gueltigkeitWarningDetails.invalidYears.length > 1
					? 'den Jahren'
					: 'dem Jahr'}
				{formatYearRanges(gueltigkeitWarningDetails.invalidYears)} nicht
				gesetzlich vorgeschrieben.
			</div>
		{/if}
		{#if missingDataWarningDetails}
			<div class="text-rsb-warning-text text-sm">
				<span class="font-semibold">Hinweis:</span> Folgende Parteien
				haben für den Posten "{missingDataWarningDetails.postenName}" in
				bestimmten Jahren keine Daten in ihren Rechenschaftsberichten
				ausgewiesen:
				{missingDataWarningDetails.details
					.map(p => `${p.party} (${formatYearRanges(p.years)})`)
					.join(', ')}.
			</div>
		{/if}
		{#if partyValidityInfo.showWarning}
			<div class="text-rsb-warning-text text-sm">
				<span class="font-semibold">Hinweis:</span>
				Nicht alle ausgewählten Parteien haben Daten {yearText}.
				Folgende Parteien sind betroffen:
				{formattedParties}.
			</div>
		{/if}
		{#if showRangeWarning || showAlleJahreBundeslandWarning}
			<div class="text-rsb-warning-text text-sm">
				<span class="font-semibold">Hinweis:</span>
				Für Bundesländer sind erst ab 2013 Daten verfügbar
			</div>
		{/if}
	</div>
{/if}
