<script lang="ts" generics="TData, TValue">
import type {
	ColumnDef,
	SortingState,
	VisibilityState,
	ColumnFiltersState,
	RowSelectionState
} from '@tanstack/table-core'
import {
	createSvelteTable,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel
} from 'tanstack-table-8-svelte-5'
import { ChevronDown } from 'lucide-svelte'
import { Input } from '$lib/components/ui/input'
import { Button } from '$lib/components/ui/button'
import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
import * as Table from '$lib/components/ui/table'

type DataTableProps<TData, TValue> = {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

let { data, columns }: DataTableProps<TData, TValue> = $props()

let sorting: SortingState = $state([])
let columnFilters: ColumnFiltersState = $state([])
let columnVisibility: VisibilityState = $state({})
let rowSelection: RowSelectionState = $state({})

const table = createSvelteTable({
	get data() {
		return data
	},
	columns,
	getCoreRowModel: getCoreRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
	getSortedRowModel: getSortedRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
	onSortingChange: e => (sorting = e),
	onColumnFiltersChange: e => (columnFilters = e),
	onColumnVisibilityChange: e => (columnVisibility = e),
	onRowSelectionChange: e => (rowSelection = e),
	state: {
		get sorting() {
			return sorting
		},
		get columnFilters() {
			return columnFilters
		},
		get columnVisibility() {
			return columnVisibility
		},
		get rowSelection() {
			return rowSelection
		}
	}
})
</script>

<div class="w-full">
	<div class="flex items-center gap-4 py-4">
		<Input
			class="max-w-sm"
			placeholder="Filter by name..."
			value={$table.getColumn('en_name')?.getFilterValue() ?? ''}
			oninput={e =>
				$table
					.getColumn('en_name')
					?.setFilterValue(e.currentTarget.value)} />
		<Input
			type="number"
			class="max-w-xs"
			placeholder="Filter by age..."
			value={$table.getColumn('age')?.getFilterValue() ?? ''}
			oninput={e =>
				$table
					.getColumn('age')
					?.setFilterValue(e.currentTarget.value)} />
		<Input
			class="max-w-sm"
			placeholder="Filter by birthday (YYYY-MM-DD)..."
			value={$table.getColumn('dob')?.getFilterValue() ?? ''}
			oninput={e =>
				$table
					.getColumn('dob')
					?.setFilterValue(e.currentTarget.value)} />
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="outline" class="ml-auto" builders={[builder]}>
					Columns <ChevronDown class="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{#each $table
					.getAllColumns()
					.filter(c => c.getCanHide()) as column}
					<DropdownMenu.CheckboxItem
						checked={column.getIsVisible()}
						onCheckedChange={e => column.toggleVisibility(!!e)}>
						{column.id}
					</DropdownMenu.CheckboxItem>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each $table.getHeaderGroups() as headerGroup}
					<Table.Row>
						{#each headerGroup.headers as header}
							<Table.Head class="[&:has([role=checkbox])]:pl-3">
								{#if header.isPlaceholder}
									{@html '&nbsp;'}
								{:else}
									<svelte:component
										this={flexRender(
											header.column.columnDef.header,
											header.getContext()
										)} />
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each $table.getRowModel().rows as row}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell}
							<Table.Cell class="[&:has([role=checkbox])]:pl-3">
								<svelte:component
									this={flexRender(
										cell.column.columnDef.cell,
										cell.getContext()
									)} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell
							colspan={columns.length}
							class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-2 py-4">
		<div class="text-muted-foreground flex-1 text-sm">
			{$table.getFilteredSelectedRowModel().rows.length} of{' '}
			{$table.getFilteredRowModel().rows.length} row(s) selected.
		</div>
		<div class="space-x-2">
			<Button
				variant="outline"
				size="sm"
				onclick={() => $table.previousPage()}
				disabled={!$table.getCanPreviousPage()}>
				Previous
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => $table.nextPage()}
				disabled={!$table.getCanNextPage()}>
				Next
			</Button>
		</div>
	</div>
</div>
