import { dev } from '$app/environment'

// Frontend Google Sheets integration
// This uses Google Apps Script as a proxy to avoid CORS issues

interface FeedbackData {
	feedback: string
	timestamp: string
	userName?: string
	deviceType?: string
	userAgent?: string
	ip?: string
	filterState?: any
}

const GOOGLE_SHEETS_CONFIG = {
	scriptUrl:
		'https://script.google.com/macros/s/AKfycbyiYWv8U0I-6RVolmbNkDENuz3azxHQUbMxrpSCttsMdTV8IgWLN5DGXqe4GMgCrOzGJQ/exec',
	spreadsheetId: '1vf_Dd8LvVi3H6Uv6SN8P4d_dq0aGUX6fEdVOmkK_Mdo',
	sheetName: 'Feedback'
}

export async function writeToGoogleSheets(
	feedbackData: FeedbackData
): Promise<boolean> {
	try {
		if (
			!GOOGLE_SHEETS_CONFIG.scriptUrl ||
			GOOGLE_SHEETS_CONFIG.scriptUrl ===
				'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'
		) {
			if (dev) {
				console.warn('⚠️ Google Apps Script URL not configured')
				console.log('💡 To enable Google Sheets integration:')
				console.log('1. Go to https://script.google.com/')
				console.log('2. Create a new project')
				console.log('3. Paste the provided Google Apps Script code')
				console.log('4. Deploy as web app and get the URL')
				console.log(
					'5. Update GOOGLE_SHEETS_CONFIG.scriptUrl in this file'
				)
			}
			return false
		}

		if (dev)
			console.log(
				'🚀 Using Google Apps Script URL:',
				GOOGLE_SHEETS_CONFIG.scriptUrl
			)

		// Prepare the data row
		const row = [
			feedbackData.timestamp,
			feedbackData.feedback,
			feedbackData.userName || 'anonymous',
			feedbackData.deviceType || 'unknown',
			feedbackData.userAgent || 'unknown',
			feedbackData.ip || 'unknown',
			JSON.stringify(feedbackData.filterState || {}),
			new Date().toISOString() // Added timestamp
		]

		if (dev) {
			console.log('📤 Sending feedback to Google Apps Script:', row)
			console.log('📡 Request details:', {
				url: GOOGLE_SHEETS_CONFIG.scriptUrl,
				method: 'POST',
				body: { action: 'addRow', data: row }
			})
		}

		// Send to Google Apps Script using form data (works better with CORS)
		const formData = new FormData()
		formData.append('action', 'addRow')
		formData.append('data', JSON.stringify(row))

		const response = await fetch(GOOGLE_SHEETS_CONFIG.scriptUrl, {
			method: 'POST',
			body: formData
		})

		if (dev)
			console.log(
				'📥 Response status:',
				response.status,
				response.statusText
			)

		if (!response.ok) {
			const errorText = await response.text()
			if (dev) console.error('❌ Response error:', errorText)
			throw new Error(
				`HTTP error! status: ${response.status} - ${errorText}`
			)
		}

		const result = await response.json()
		if (dev) console.log('✅ Google Sheets response:', result)

		if (result.success) {
			if (dev) console.log('🎉 Successfully added row to Google Sheets!')
			return true
		} else {
			if (dev)
				console.error(
					'❌ Google Apps Script returned error:',
					result.error
				)
			return false
		}
	} catch (error) {
		if (dev) console.error('❌ Error writing to Google Sheets:', error)
		return false
	}
}

/**
 * Alternative: Direct Google Sheets API approach (requires public sheet)
 * This is a fallback if Google Apps Script doesn't work
 */
export async function writeToGoogleSheetsDirectly(
	feedbackData: FeedbackData
): Promise<boolean> {
	try {
		if (
			!GOOGLE_SHEETS_CONFIG.spreadsheetId ||
			GOOGLE_SHEETS_CONFIG.spreadsheetId === 'YOUR_SPREADSHEET_ID_HERE'
		) {
			if (dev)
				console.warn(
					'⚠️ Spreadsheet ID not configured for direct API access'
				)
			return false
		}

		// This approach requires the sheet to be publicly writable
		// Not recommended for production but fine for internal testing
		const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/edit#gid=0`

		if (dev) {
			console.log('📋 For manual entry, copy this data to:', url)
			console.log('Data to add:', {
				timestamp: feedbackData.timestamp,
				feedback: feedbackData.feedback,
				userName: feedbackData.userName || 'anonymous',
				deviceType: feedbackData.deviceType || 'unknown'
			})
		}

		return false
	} catch (error) {
		if (dev)
			console.error('❌ Error with direct Google Sheets access:', error)
		return false
	}
}

// Export the main function
export default writeToGoogleSheets
