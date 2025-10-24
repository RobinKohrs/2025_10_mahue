<script lang="ts">
  import { MoreHorizontal } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import type { Person } from "./columns";

  let { row }: { row: Person } = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button variant="ghost" class="h-8 w-8 p-0" builders={[builder]}>
      <span class="sr-only">Open menu</span>
      <MoreHorizontal class="h-4 w-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Label>Actions</DropdownMenu.Label>
    <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(row.id)}>
      Copy ID
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>View details</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
