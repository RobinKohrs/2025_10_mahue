import Papa from 'papaparse'

/**
 * @returns {Promise<any[]>}
 */
async function getCsvData(fetch) {
	// Simulate a 2-second network delay
	await new Promise(resolve => setTimeout(resolve, 2000))

	const response = await fetch(`/sample-data.csv`)
	const csvText = await response.text()
	return new Promise(resolve => {
		Papa.parse(csvText, {
			header: true,
			dynamicTyping: true,
			complete: results => {
				resolve(results.data)
			}
		})
	})
}

/** @type {import('./$types').PageLoad} */
export function load({ fetch }) {
	return {
		itemsPromise: getCsvData(fetch)
	}
}
