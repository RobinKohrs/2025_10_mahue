<script>
import { onMount } from 'svelte'

let height = 200
let isInIframe = false

onMount(() => {
	isInIframe = window.parent !== window
})

function increaseHeight() {
	height += 100
}

function decreaseHeight() {
	height = Math.max(100, height - 100)
}
</script>

<svelte:head>
	<title>Iframe Test - RSB 2025</title>
</svelte:head>

<div class="p-4">
	<h1 class="text-2xl font-bold mb-4">Iframe Height Test</h1>
	
	{#if isInIframe}
		<div class="bg-green-100 p-4 rounded mb-4">
			<p class="text-green-800">✅ Running inside iframe - height updates will be sent to parent</p>
		</div>
	{:else}
		<div class="bg-yellow-100 p-4 rounded mb-4">
			<p class="text-yellow-800">⚠️ Not in iframe - height updates will not be sent</p>
		</div>
	{/if}

	<div class="space-y-4">
		<div class="flex gap-4">
			<button 
				onclick={increaseHeight}
				class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
				Increase Height (+100px)
			</button>
			<button 
				onclick={decreaseHeight}
				class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
				Decrease Height (-100px)
			</button>
		</div>

		<div class="bg-gray-100 p-4 rounded" style="height: {height}px;">
			<p class="text-lg">Current height: {height}px</p>
			<p class="text-sm text-gray-600 mt-2">
				This content area changes height to test iframe communication.
				If you're viewing this in an iframe, the parent should automatically adjust.
			</p>
		</div>

		<div class="bg-blue-50 p-4 rounded">
			<h2 class="font-semibold mb-2">Instructions:</h2>
			<ol class="list-decimal list-inside space-y-1 text-sm">
				<li>Open <code>/embed.html</code> to test iframe embedding</li>
				<li>Use the buttons above to change content height</li>
				<li>Check that the iframe height adjusts automatically</li>
				<li>Open browser dev tools to see message events</li>
			</ol>
		</div>
	</div>
</div>
