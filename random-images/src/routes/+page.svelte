<script>
import { onMount } from 'svelte'
import Papa from 'papaparse'

let accidents = $state([])

onMount(() => {
	fetchAccidents()
})

async function fetchAccidents() {
	try {
		const response = await fetch(`/unfaelle_mahue.csv`)
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		const csvText = await response.text()

		Papa.parse(csvText, {
			header: true,
			complete: results => {
				accidents = results.data
			}
		})
	} catch (error) {
		console.error('Error fetching the CSV file:', error)
	}
}
</script>

<div class="dj-container">
	<h1 class="dj-title">Bike Accidents</h1>
	<pre>{JSON.stringify(accidents, null, 2)}</pre>
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
	margin: 10px auto 0;
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
.dj-button {
	background-color: #b56161;
	font-family: 'STMatilda Info Variable', Arial, sans-serif;
	color: white;
	padding: 10px 15px;
	border: none;
	cursor: pointer;
	font-size: 16px;
}
.dj-button:hover {
	background-color: #a05454;
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
