<script lang="ts">
import { assets } from '$app/paths'

interface LoadingScreenProps {
	/**
	 * Optional message to display below the spinner
	 */
	message?: string
	/**
	 * Size of the loading spinner ('sm', 'md', 'lg')
	 */
	size?: 'sm' | 'md' | 'lg'
	/**
	 * Whether to show as overlay or inline
	 */
	overlay?: boolean
	/**
	 * Custom class for styling
	 */
	class?: string
}

let {
	message = 'Daten werden geladen...',
	size = 'md',
	overlay = false,
	class: className = ''
}: LoadingScreenProps = $props()

const messageText = $derived(
	message?.endsWith('...') ? message.slice(0, -3) : message
)
const showDots = $derived(message?.endsWith('...'))
</script>

<div
	class={[
		overlay
			? 'fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm'
			: 'flex items-center justify-center p-8',
		className
	]}
	style={overlay ? 'background-color: rgba(215, 226, 232, 0.8);' : ''}>
	<div class="flex flex-col items-center space-y-4">
		<!-- Spinner -->
		<div
			class={[
				'relative',
				size === 'sm' && 'size-6',
				size === 'md' && 'size-10',
				size === 'lg' && 'size-20'
			]}>
			<img
				src="{assets}/logo.webp"
				alt="Loading..."
				class="spinner h-full w-full" />
		</div>

		<!-- Message -->
		{#if message}
			<p class="text-center text-sm text-gray-600">
				{messageText}{#if showDots}<span class="dot"></span><span
						class="dot"></span
					><span class="dot"></span>{/if}
			</p>
		{/if}
	</div>
</div>

<style>
@keyframes pulseOpacity {
	from {
		opacity: 0.4;
	}
	to {
		opacity: 1;
	}
}
@keyframes bounce {
	0%,
	80%,
	100% {
		transform: scale(0);
	}
	40% {
		transform: scale(1);
	}
}
.spinner {
	animation: pulseOpacity 1.2s ease-in-out infinite alternate;
}
.dot {
	display: inline-block;
	animation: bounce 1.4s infinite ease-in-out both;
	width: 4px;
	height: 4px;
	background-color: #6b7280; /* text-gray-500 */
	border-radius: 50%;
	margin-left: 2px;
}
.dot:nth-child(1) {
	animation-delay: -0.32s;
}
.dot:nth-child(2) {
	animation-delay: -0.16s;
}
</style>
