<script>
import { onMount } from 'svelte'
import Papa from 'papaparse'

let accidents = $state([])
let randomAccident = $state(null)
let imageUrl = $state('')
let detailsVisible = $state()
let accidentText = $state('')

const monthMap = {
	'1': 'Jänner',
	'2': 'Februar',
	'3': 'März',
	'4': 'April',
	'5': 'Mai',
	'6': 'Juni',
	'7': 'Juli',
	'8': 'August',
	'9': 'September',
	'10': 'Oktober',
	'11': 'November',
	'12': 'Dezember'
}

const weekdayMap = {
	Mon: 'Montag',
	Tue: 'Dienstag',
	Wed: 'Mittwoch',
	Thu: 'Donnerstag',
	Fri: 'Freitag',
	Sat: 'Samstag',
	Sun: 'Sonntag'
}

function generateAccidentText(accident) {
	if (!accident || !accident.UHRZEIT) return ''

	const year = accident.JAHR
	const month = monthMap[accident.MONAT] || accident.MONAT
	const weekday = weekdayMap[accident.WOCHENTAG] || accident.WOCHENTAG
	const beteiligung = accident.BETEILIGUNG

	let timeClause = ''
	if (accident.UHRZEIT.includes('bis')) {
		timeClause = `zwischen <strong>${accident.UHRZEIT.replace('bis', 'und')}</strong>`
	} else {
		timeClause = `um <strong>${accident.UHRZEIT}</strong>`
	}

	return `Dieser Unfall ereignete sich an einem <strong>${weekday}</strong> im <strong>${month} ${year}</strong> ${timeClause}. Beteiligte: <strong>${beteiligung}</strong>.`
}

$effect(() => {
	if (randomAccident) {
		accidentText = generateAccidentText(randomAccident)
	}
})

onMount(() => {
	fetchAccidents()
})

function toggleDetails() {
	detailsVisible = !detailsVisible
}

function selectRandomAccident() {
	if (accidents.length > 0) {
		const randomIndex = Math.floor(Math.random() * accidents.length)
		randomAccident = accidents[randomIndex]
		detailsVisible = false // Collapse details on new accident
		updateImageUrl()
	}
}

async function updateImageUrl() {
	if (randomAccident) {
		const url = `atlas/uid_${randomAccident.uid}.webp?testsasd`
		try {
			const response = await fetch(url)
			if (response.ok) {
				imageUrl = url
			} else {
				imageUrl = '' // Or a placeholder image
			}
		} catch (error) {
			imageUrl = '' // Or a placeholder image
		}
	}
}

async function fetchAccidents() {
	try {
		const response = await fetch(`unfaellle_mh.csv`)
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		const csvText = await response.text()

		Papa.parse(csvText, {
			header: true,
			complete: results => {
				accidents = results.data
					.map((row, index) => ({ ...row, uid: index + 1 }))
					.filter(a => a.REFUOID) // Use a valid column to filter empty rows
				selectRandomAccident()
			}
		})
	} catch (error) {
		console.error('Error fetching the CSV file:', error)
	}
}
</script>

<div class="dj-container">
	{#if accidents.length > 0 && randomAccident}
		<div class="accident-details">
			{#if imageUrl}
				<div class="image-container">
					<img
						src={imageUrl}
						alt="Unfallort"
						class="accident-image" />
					<button
						class="custom-button top-left hover:bg-red-500"
						on:click={selectRandomAccident}>
						Zufälliger Unfall
					</button>

					<button
						class="custom-button top-right"
						on:click={toggleDetails}>
						ⓘ
					</button>

					{#if detailsVisible}
						<div class="modal-overlay" on:click={toggleDetails}>
							<div class="modal-content" on:click|stopPropagation>
								<button
									class="modal-close"
									on:click={toggleDetails}>×</button>
								<p>{@html accidentText}</p>
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<p>Bild für diesen Unfall nicht verfügbar.</p>
				<button
					class="custom-button standalone"
					on:click={selectRandomAccident}>
					Zufälliger Unfall
				</button>
			{/if}
		</div>
	{:else if accidents.length > 0}
		<p>Loading accident...</p>
	{:else}
		<p>Loading data...</p>
	{/if}
</div>

<style>
@font-face {
	font-display: swap;
	font-family: 'STMatilda Info Variable';
	font-style: normal;
	font-weight: 200 900;
	src: url(https://b.staticfiles.at/s/fonts/stmatilda/v1/stmatilda-info.woff2)
		format('woff2-variations');
	unicode-range:
		U+000A, U+0020-002F, U+0030-0039, U+003A-0040, U+0041-005A, U+005B-0060,
		U+0061-007A, U+007B-007E, U+2013, U+203A, U+2026, U+201E, U+201C,
		U+00A9, U+20AC, U+00C0-00FF, U+1E9E, U+011E, U+011F, U+0160, U+0161,
		U+201A, U+2018, U+00A0-00A8, U+00AA-00BF, U+0100-011D, U+0120-0148,
		U+014A-015F, U+0162-017F, U+0180-01BF, U+0200-0217, U+0218-021B, U+1F5E9;
}

@font-face {
	font-display: swap;
	font-family: 'STMatilda Text Variable';
	font-style: normal;
	font-weight: 300 700;
	src: url(https://b.staticfiles.at/s/fonts/stmatilda/v1/stmatilda-text.woff2)
		format('woff2-variations');
	unicode-range:
		U+000A, U+0020-002F, U+0030-0039, U+003A-0040, U+0041-005A, U+005B-0060,
		U+0061-007A, U+007B-007E, U+2013, U+203A, U+2026, U+201E, U+201C,
		U+00A9, U+20AC, U+00C0-00FF, U+1E9E, U+011E, U+011F, U+0160, U+0161,
		U+201A, U+2018, U+00A0-00A8, U+00AA-00BF, U+0100-011D, U+0120-0148,
		U+014A-015F, U+0162-017F, U+0180-01BF, U+0200-0217, U+0218-021B;
}

.dj-container {
	font-family: 'STMatilda Info Variable', Arial, sans-serif;
	max-width: 615px;
	margin: 0 auto;
	padding: 20px;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	background-color: rgba(255, 255, 255, 0.2) !important;
	border-radius: 8px !important;
}
.dj-title {
	font-size: 24px;
	font-weight: bold;
	margin: 0 0 10px 0;
	text-align: center;
}
.dj-person-info {
	margin-top: 10px;
	font-size: 18px;
	min-height: 54px; /* Enough space for two lines */
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	color: #b56161;
	font-family: 'STMatilda Text Variable', Arial, sans-serif;
}
.dj-day-highlight {
	font-weight: 900;
	font-size: 1.1rem;
}
.dj-button {
	display: block;
	position: absolute;
	top: 10px;
	left: 10px;
	z-index: 10;
	margin: 10px auto 0;
	background-color: #b56161;
	font-family: 'STMatilda Info Variable', Arial, sans-serif;
	color: green;
	padding: 10px 15px;
	border: none;
	cursor: pointer;
	font-size: 16px;
}
.dj-button:hover {
	background-color: #a05454;
}
.dj-button.standalone {
	position: static;
	margin-top: 10px;
	background-color: rgba(255, 255, 255, 0.9);
	color: #333;
	border: 1px solid #ccc;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
	padding: 8px 12px;
	font-size: 14px;
	cursor: pointer;
}
.dj-day-section {
	margin-bottom: 0;
}
.dj-day-section + .dj-day-section {
	border-top: 1px solid #eee;
	padding-top: 15px;
}
.dj-day-section p {
	margin-top: 0;
	margin-bottom: 10px;
	text-align: center;
}
.dj-source {
	font-size: 12px;
	color: #666;
	text-align: center;
	margin-top: 10px;
	border-top: 1px solid #eee;
	padding-top: 10px;
}
.dj-source a {
	color: #666;
	text-decoration: none;
}
.dj-source a:hover {
	text-decoration: underline;
}
.accident-details {
	margin-bottom: 20px;
	text-align: center;
}
.image-container {
	position: relative;
	margin-bottom: 10px;
}
.accident-image {
	max-width: 100%;
	height: auto;
	display: block;
}
.custom-button {
	position: absolute;
	z-index: 10;
	background-color: rgba(255, 255, 255, 0.9);
	color: #333;
	border: 1px solid #ccc;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
	padding: 8px 12px;
	font-size: 14px;
	cursor: pointer;
	border-radius: 6px;
}
.custom-button:hover {
	background-color: #aaa;
}
.custom-button.top-left {
	top: 10px;
	left: 10px;
}
.custom-button.top-right {
	top: 10px;
	right: 10px;
	width: 30px;
	height: 30px;
	padding: 0;
	border-radius: 50%;
	font-size: 20px;
	line-height: 30px;
	text-align: center;
}
.custom-button.standalone {
	position: static;
	margin-top: 10px;
}
.modal-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.75);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 20;
}
.modal-content {
	background-color: white;
	padding: 20px;
	border-radius: 5px;
	position: relative;
	color: #333;
	max-width: 80%;
}
.modal-close {
	position: absolute;
	top: 5px;
	right: 10px;
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
	color: #999;
}
.details-content {
	margin-top: 10px;
}

@media (max-width: 615px) {
	.dj-day-section + .dj-day-section {
		padding-top: 10px;
	}
	.dj-container {
		padding: 15px;
	}
	.dj-title {
		font-size: 1.2rem;
	}
	.dj-person-info {
		font-size: 1rem;
		min-height: 48px;
	}
}
</style>
