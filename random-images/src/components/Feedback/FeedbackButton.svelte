<script lang="ts">
import { dev } from '$app/environment'
import Button from '$components/Button/Button.svelte'
import { filterStateContext } from '$state/filterState.svelte.ts'

const filterState = filterStateContext.get()

let showFeedbackForm = $state(false)
let feedbackText = $state('')
let userName = $state('')
let includeFilterState = $state(false)
let isMobile = $state(false)
let isSubmitting = $state(false)
let submitSuccess = $state(false)
let submitError = $state('')

// Detect if user is on mobile device
function detectDevice() {
	if (typeof window !== 'undefined') {
		const userAgent = navigator.userAgent.toLowerCase()
		const isMobileDevice =
			/android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
				userAgent
			)
		isMobile = isMobileDevice
	}
}

function toggleFeedbackForm() {
	showFeedbackForm = !showFeedbackForm
	if (!showFeedbackForm) {
		// Reset form when closing
		feedbackText = ''
		userName = ''
		includeFilterState = false
		submitSuccess = false
		submitError = ''
	} else {
		// Detect device when opening form
		detectDevice()
	}
}

async function submitFeedback() {
	if (!feedbackText.trim()) {
		submitError = 'Bitte geben Sie Ihr Feedback ein.'
		return
	}

	isSubmitting = true
	submitError = ''

	try {
		const feedbackData = {
			feedback: feedbackText.trim(),
			userName: userName.trim() || undefined,
			timestamp: new Date().toISOString(),
			deviceType: isMobile ? 'mobile' : 'desktop',
			userAgent:
				typeof navigator !== 'undefined'
					? navigator.userAgent
					: undefined,
			...(includeFilterState && {
				filterState: {
					inputs: Object.fromEntries(
						Object.entries(filterState.inputs).map(
							([key, value]) => [
								key,
								{
									filter: value.filter,
									selected: Array.from(value.selected || [])
								}
							]
						)
					),
					blockDecision: filterState.blockDecision
				}
			})
		}

		// Add client-side data (no server needed!)
		const processedData = {
			...feedbackData,
			userAgent:
				typeof navigator !== 'undefined'
					? navigator.userAgent
					: 'unknown',
			ip: 'client-side', // We can't get real IP from frontend, but that's fine
			timestamp: new Date().toISOString()
		}

		if (dev)
			console.log('📨 Processing feedback client-side:', processedData)

		// Send directly to Google Sheets from frontend
		try {
			// Import the Google Sheets function
			const { writeToGoogleSheets } = await import('$lib/googleSheets')
			const sheetsSuccess = await writeToGoogleSheets(processedData)

			if (sheetsSuccess) {
				if (dev) console.log('✅ Feedback saved to Google Sheets')
			} else {
				if (dev)
					console.log(
						'⚠️ Google Sheets not configured, but feedback was processed'
					)
			}
		} catch (sheetsError) {
			if (dev) console.warn('⚠️ Google Sheets error:', sheetsError)
			// Don't fail the whole process if sheets fails
		}

		submitSuccess = true
		feedbackText = ''
		userName = ''
		includeFilterState = false

		// Auto-close after 2 seconds
		setTimeout(() => {
			showFeedbackForm = false
			submitSuccess = false
		}, 2000)
	} catch (error) {
		if (dev) console.error('Feedback submission error:', error)
		submitError =
			'Fehler beim Senden. Bitte versuchen Sie es später erneut.'
	} finally {
		isSubmitting = false
	}
}
</script>

<!-- Feedback Button -->
<div
	class="inline-block"
	style="font-family: 'STMatilda Info Variable', sans-serif;">
	<Button
		size="lg"
		color={showFeedbackForm ? 'secondary' : 'primary'}
		onclick={toggleFeedbackForm}
		class="shadow-lg">
		{showFeedbackForm ? '✕' : '💬'} Feedback
	</Button>
</div>

<!-- Feedback Form Modal -->
{#if showFeedbackForm}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
		role="button"
		tabindex="0"
		onclick={toggleFeedbackForm}
		onkeydown={e => e.key === 'Escape' && toggleFeedbackForm()}
		aria-label="Feedback-Formular schließen">
	</div>

	<!-- Modal -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		style="font-family: 'STMatilda Info Variable', sans-serif;">
		<div
			class="relative w-full max-w-lg transform rounded-xl bg-white p-8 shadow-2xl transition-all">
			<!-- Close button -->
			<button
				onclick={toggleFeedbackForm}
				class="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
				aria-label="Feedback-Formular schließen">
				<svg
					class="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
			<!-- Header -->
			<div class="mb-6 text-center">
				<h3 class="mb-2 text-2xl font-bold text-gray-900">
					💬 Ihr Feedback
				</h3>
				<p class="text-gray-600">
					Helfen Sie uns, die Anwendung zu verbessern
				</p>
			</div>

			{#if submitSuccess}
				<div class="py-8 text-center">
					<div
						class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
						<svg
							class="h-8 w-8 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"></path>
						</svg>
					</div>
					<h4 class="mb-2 text-xl font-semibold text-gray-900">
						Vielen Dank!
					</h4>
					<p class="text-gray-600">
						Ihr Feedback wurde erfolgreich gesendet.
					</p>
				</div>
			{:else}
				<!-- Name Field (Optional) -->
				<div class="mb-6">
					<label
						for="feedback-name"
						class="mb-2 block text-sm font-medium text-gray-700">
						Ihr Name (optional)
					</label>
					<input
						id="feedback-name"
						type="text"
						bind:value={userName}
						placeholder="Max Mustermann"
						class="w-full rounded-lg border-gray-300 p-3 shadow-sm transition-colors focus:border-blue-500 focus:ring-blue-500"
						disabled={isSubmitting} />
				</div>

				<!-- Checkboxes -->
				<div class="mb-6 space-y-3">
					<label class="flex cursor-pointer items-start space-x-3">
						<input
							type="checkbox"
							bind:checked={includeFilterState}
							class="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0" />
						<div class="flex-1">
							<span class="text-sm font-medium text-gray-700">
								Zu dieser Grafik
							</span>
							<p class="text-xs text-gray-500">
								Aktuelle Filtereinstellungen mitschicken
							</p>
						</div>
					</label>

					<label class="flex cursor-pointer items-start space-x-3">
						<input
							type="checkbox"
							bind:checked={isMobile}
							class="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0" />
						<div class="flex-1">
							<span class="text-sm font-medium text-gray-700">
								Mobiles Gerät
							</span>
							<p class="text-xs text-gray-500">
								Ich verwende ein Smartphone/Tablet
							</p>
						</div>
					</label>
				</div>

				<!-- Feedback Text Area -->
				<div class="mb-6">
					<label
						for="feedback-text"
						class="mb-2 block text-sm font-medium text-gray-700">
						Ihr Feedback *
					</label>
					<textarea
						id="feedback-text"
						bind:value={feedbackText}
						placeholder="Beschreiben Sie Ihre Erfahrung, Verbesserungsvorschläge oder Probleme..."
						rows="5"
						class="w-full resize-none rounded-lg border-gray-300 p-3 shadow-sm transition-colors focus:border-blue-500 focus:ring-blue-500"
						disabled={isSubmitting}></textarea>
					<p class="mt-1 text-xs text-gray-500">* Pflichtfeld</p>
				</div>

				<!-- Error Message -->
				{#if submitError}
					<div
						class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
						<div class="flex items-center">
							<svg
								class="mr-2 h-5 w-5 text-red-400"
								fill="currentColor"
								viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clip-rule="evenodd" />
							</svg>
							<span class="text-sm font-medium text-red-800"
								>{submitError}</span>
						</div>
					</div>
				{/if}

				<!-- Filter State Preview (when checkbox is checked) -->
				{#if includeFilterState}
					<div
						class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
						<div class="mb-2 flex items-center">
							<svg
								class="mr-2 h-4 w-4 text-blue-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span class="text-sm font-medium text-blue-800"
								>Aktuelle Filter:</span>
						</div>
						<div class="grid grid-cols-2 gap-2 text-xs">
							<div class="rounded bg-white p-2">
								<span class="font-medium text-gray-600"
									>Jahr:</span>
								<span class="text-gray-800"
									>{filterState.inputs.jahr.filter}</span>
							</div>
							<div class="rounded bg-white p-2">
								<span class="font-medium text-gray-600"
									>Partei:</span>
								<span class="text-gray-800"
									>{filterState.inputs.parteiId.filter}</span>
							</div>
							<div class="rounded bg-white p-2">
								<span class="font-medium text-gray-600"
									>Posten:</span>
								<span class="text-gray-800"
									>{filterState.inputs.postenArt
										.filter}</span>
							</div>
							<div class="rounded bg-white p-2">
								<span class="font-medium text-gray-600"
									>Gebiet:</span>
								<span class="text-gray-800"
									>{filterState.inputs.gebiet.filter}</span>
							</div>
						</div>
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="flex flex-col-reverse gap-3 dt:flex-row">
					<Button
						size="lg"
						color="secondary"
						onclick={toggleFeedbackForm}
						disabled={isSubmitting}
						class="flex-1 justify-center">
						Abbrechen
					</Button>
					<Button
						size="lg"
						color="primary"
						onclick={submitFeedback}
						disabled={isSubmitting || !feedbackText.trim()}
						class="flex-1 transform justify-center border-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 hover:shadow-xl focus:ring-purple-500">
						{#if isSubmitting}
							<svg
								class="mr-2 h-4 w-4 animate-spin"
								fill="none"
								viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Wird gesendet...
						{:else}
							💌 Feedback senden
						{/if}
					</Button>
				</div>
			{/if}
		</div>
	</div>
{/if}
