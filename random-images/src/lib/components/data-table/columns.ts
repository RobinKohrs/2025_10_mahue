import type { ColumnDef } from '@tanstack/table-core'
import { Checkbox } from '$lib/components/ui/checkbox'
import { renderComponent } from '$lib/components/ui/data-table'
import DataTableColumnHeader from './DataTableColumnHeader.svelte'
import DataTableActions from './DataTableActions.svelte'

export type Person = {
	name: string
	en_name: string
	id: string
	dob: string
	sex: 'm' | 'f'
	age: number
	source: 'h' | 'c' | 'j' | 'u'
	update: number
}

export const columns: ColumnDef<Person>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(Checkbox, {
				checked:
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate'),
				onCheckedChange: value => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all'
			}),
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: row.getIsSelected(),
				onCheckedChange: value => row.toggleSelected(!!value),
				'aria-label': 'Select row'
			}),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'en_name',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, {
				column,
				title: 'Name'
			}),
		cell: ({ row }) => `<div class="font-medium">${row.getValue('en_name')}</div>`
	},
	{
		accessorKey: 'age',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader, {
				column,
				title: 'Age'
			}),
		cell: ({ row }) => `<div class="text-right">${row.getValue('age')}</div>`
	},
	{
		accessorKey: 'dob',
		header: 'Date of Birth',
		cell: ({ row }) => row.getValue('dob')
	},
	{
		accessorKey: 'sex',
		header: 'Sex',
		cell: ({ row }) => `<div class="capitalize">${row.getValue('sex')}</div>`
	},
	{
		id: 'actions',
		cell: ({ row }) => renderComponent(DataTableActions, { row: row.original })
	}
]
