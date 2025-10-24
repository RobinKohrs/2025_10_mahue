<script lang="ts">
import FakeBarChart from './FakeBarChart.svelte'
let {
	reason = 'Für die gewählten Filterkriterien wurden <b>keine Daten</b> gefunden.'
} = $props<{ reason?: string | null }>()
</script>

<div
	class="flex min-h-[400px] flex-col items-center justify-center gap-y-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
	<div class="h-[100px] w-[100px]">
		<FakeBarChart />
	</div>
	<div class="max-w-md text-base">{@html reason}</div>
</div>
