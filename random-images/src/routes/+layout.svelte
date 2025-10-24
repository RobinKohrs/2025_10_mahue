<script lang="ts">
// Import app styles first to ensure they don't override the grid theme.
import '../styles/app.css'

// Import AG Grid styles last so they have priority.
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

import type { LayoutProps } from './$types'

let { children }: LayoutProps = $props()
</script>

<svelte:head>
	<title>Gaza Namenslisten</title>
</svelte:head>

<div id="dj-app">
	<main>
		{@render children()}
	</main>
</div>

<style>
</style>
