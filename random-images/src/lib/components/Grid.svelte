<script lang="ts" generics="TRow">
import { onMount } from 'svelte'
import {
	createGrid,
	ModuleRegistry,
	ClientSideRowModelModule,
	TextFilterModule,
	NumberFilterModule,
	DateFilterModule,
	type GridOptions,
	type ColDef
} from 'ag-grid-community'

// ✅ Register everything you need
ModuleRegistry.registerModules([
	ClientSideRowModelModule,
	TextFilterModule,
	NumberFilterModule,
	DateFilterModule
])

type Props = {
	rowData: TRow[]
	columnDefs: ColDef<TRow>[]
}

let { rowData, columnDefs }: Props = $props()
let gridDiv: HTMLDivElement

onMount(() => {
	const gridOptions: GridOptions<any> = {
		columnDefs,
		rowData,
		defaultColDef: {
			sortable: true,
			floatingFilter: true,
			flex: 1,
			// ✅ default filter type
			filter: 'agTextColumnFilter',
			// ✅ default filter params
			filterParams: {
				// make text filters "contains" by default
				filterOptions: ['contains'],
				suppressAndOrCondition: true
			}
		}
	}

	if (gridDiv) {
		const gridApi = createGrid(gridDiv, gridOptions)

		return () => {
			gridApi.destroy()
		}
	}
})
</script>

<div
	bind:this={gridDiv}
	class="ag-theme-quartz-dark"
	style="height: 500px; width: 100%;">
</div>
