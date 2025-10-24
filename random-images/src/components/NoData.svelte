<script lang="ts">
import { formatYearRanges } from '$utils/format'

let {
	reason = 'Für die gewählten Filterkriterien wurden keine Daten gefunden.'
} = $props<{ reason?: string | null }>()
</script>

<div
	class="flex min-h-[400px] flex-col items-center justify-center gap-y-1 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center text-gray-500">
	<div class="text-lg font-semibold">Keine Daten verfügbar</div>
	<div class="text-sm">{reason}</div>
</div>
