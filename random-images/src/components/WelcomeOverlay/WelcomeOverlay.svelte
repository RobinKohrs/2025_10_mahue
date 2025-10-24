<script>
import { onMount } from 'svelte'
import { X } from 'phosphor-svelte'

let {
	onClose = () => {},
	forceShow = false,
	isInitialShow = false,
	onDismissForever = () => {}
} = $props()

let showOverlay = $state(false)
let overlayElement = $state()
let isInitialLoad = $state(false)

const STORAGE_KEY = 'rsb-welcome-overlay-dismissed'

function closeOverlay() {
	showOverlay = false
	onClose()
}

function dismissForever() {
	localStorage.setItem(STORAGE_KEY, 'true')
	onDismissForever() // Call the callback to update loading state
	closeOverlay()
}

function handleKeydown(/** @type {KeyboardEvent} */ e) {
	if (e.key === 'Escape') {
		closeOverlay()
	}
}

// React to forceShow prop changes
$effect(() => {
	if (forceShow) {
		showOverlay = true
		// Set isInitialLoad based on the isInitialShow prop
		isInitialLoad = isInitialShow
	}
})

onMount(() => {
	// Check if user has previously dismissed the overlay
	const isDismissed = localStorage.getItem(STORAGE_KEY) === 'true'

	if (!isDismissed && !forceShow) {
		// Small delay to allow page to load
		setTimeout(() => {
			showOverlay = true
			isInitialLoad = true
		}, 500)
	}

	return () => {
		// Cleanup if needed
	}
})
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showOverlay}
	<!-- Backdrop -->
	<div
		onclick={closeOverlay}
		onkeydown={handleKeydown}
		style:background-color={showOverlay
			? 'rgba(215, 226, 232, 0.95)'
			: 'transparent'}
		class="rsb-welcome-overlay fixed inset-0 z-50 cursor-default backdrop-blur-sm transition-all duration-300">
		<!-- Centering Container -->
		<div
			class="z-60 fixed inset-0 flex cursor-default items-center justify-center p-4"
			onclick={closeOverlay}
			onkeydown={e => e.key === 'Enter' && closeOverlay()}
			role="button"
			tabindex="0">
			<!-- Overlay Content -->
			<div
				bind:this={overlayElement}
				class="relative flex max-h-[90%] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white"
				onclick={e => e.stopPropagation()}
				onkeydown={e => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				tabindex="-1">
				<!-- Header -->
				<div
					class="bg-secondary/10 text-primary sticky top-0 z-10 flex items-center gap-x-2 border-b border-gray-100 p-2.5">
					<div
						class="dt:pl-0 dt:text-center flex-grow pl-2 text-left">
						<h2 class="text-xl font-bold">Die Spur des Geldes</h2>
						<p class="text-primary/70 text-sm">
							Erkunden Sie die Finanzdaten der österreichischen
							Parteien
						</p>
					</div>

					<div class="flex justify-end">
						<button
							onclick={closeOverlay}
							class="bg-secondary/50 text-primary hover:bg-secondary active:bg-primary flex h-10 w-10 items-center justify-center rounded-full transition-colors active:text-white"
							title="Schließen">
							<X size={24} weight="bold" />
						</button>
					</div>
				</div>

				<!-- Scrolling Content Area -->
				<div class="scroller flex-grow overflow-y-auto">
					<!-- Content -->
					<div class="dt:p-6 px-4 py-3.5 pb-16">
						<!-- Introduction -->
						<div class="mb-8">
							<h3
								class="mb-3 text-lg font-semibold text-gray-900">
								Was kann dieses Tool?
							</h3>
							<p class="text-sm leading-relaxed text-gray-700">
								Mit unserem Rechenschaftsbericht-Explorer können
								Sie die Geldflüsse der Parteien einfach und
								interaktiv ansehen. Vergleichen Sie Einnahmen,
								Ausgaben und Salden über verschiedene Jahre,
								Bundesländer und Kostenarten hinweg.
							</p>
						</div>

						<!-- Key Concepts -->
						<div class="space-y-4">
							<div>
								<h4
									class="border-rsb-highlight mb-2 border-b-2 pb-1 font-semibold text-gray-900">
									Filter anwenden
								</h4>
								<p
									class="text-sm leading-relaxed text-gray-700">
									Passen Sie Ihre Ansicht mit den Filtern oben
									an:<br />
									<strong>Jahre</strong> – wählen Sie den
									Zeitraum<br />
									<strong>Parteien</strong> – wählen Sie
									einzelne oder mehrere Parteien<br />
									<strong>Posten</strong> – wählen Sie
									Einnahmen, Ausgaben oder bestimmte
									Kostenarten<br />
									<strong>Gebiet</strong> – wählen Sie Bund oder
									einzelne Bundesländer
								</p>
							</div>

							<div>
								<h4
									class="border-rsb-highlight mb-2 border-b-2 pb-1 font-semibold text-gray-900">
									Daten verstehen
								</h4>
								<p
									class="text-sm leading-relaxed text-gray-700">
									<strong>Einnahmen</strong> = Geld, das
									Parteien bekommen (z.B. Spenden,
									Mitgliedsbeiträge)<br />
									<strong>Ausgaben</strong> = Geld, das
									Parteien ausgeben (z.B. Personal,
									Wahlkämpfe)<br />
									<strong>Saldo</strong> = Differenz zwischen Einnahmen
									und Ausgaben
								</p>
							</div>

							<div>
								<h4
									class="border-rsb-highlight mb-2 border-b-2 pb-1 font-semibold text-gray-900">
									Interaktive Analyse
								</h4>
								<p
									class="text-sm leading-relaxed text-gray-700">
									Klicken Sie auf Diagrammelemente, um Details
									zu sehen. Kombinieren Sie verschiedene
									Filter für gezielte Einblicke – die Grafiken
									passen sich sofort an.
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Footer - Only show on initial load -->
				{#if isInitialLoad}
					<div
						class="border-t border-gray-200 bg-white px-6 py-4 text-center">
						<button
							onclick={dismissForever}
							class="bg-secondary/50 text-primary hover:bg-secondary active:bg-primary rounded-lg px-4 py-2 text-sm font-medium transition-colors active:text-white">
							Verstanden, nicht mehr anzeigen
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
/* Ensure overlay is above everything else */
:global(body:has(.rsb-welcome-overlay)) {
	overflow: hidden;
}

.scroller {
	-webkit-mask-image: linear-gradient(
		to bottom,
		black 0%,
		black 93%,
		transparent 100%
	);
	mask-image: linear-gradient(
		to bottom,
		black 0%,
		black 93%,
		transparent 100%
	);
	scrollbar-color: hsl(var(--primary)) transparent;
}

.scroller::-webkit-scrollbar {
	width: 10px;
	height: 15px;
}

.scroller::-webkit-scrollbar-track {
	background-color: hsl(var(--rsb-highlight-light));
}

.scroller::-webkit-scrollbar-thumb {
	background-color: hsl(var(--primary));
}
</style>
