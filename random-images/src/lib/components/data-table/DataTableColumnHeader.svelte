<script lang="ts">
  import type { Column } from "@tanstack/table-core";
  import type { Person } from "./columns";
  import { Button } from "$lib/components/ui/button";
  import { ArrowUpDown } from "lucide-svelte";
  import { cn } from "$lib/utils";

  type Props = {
    column: Column<Person>;
    title: string;
    class?: string;
  };
  let { column, title, class: className }: Props = $props();
</script>

<div class={cn("flex items-center space-x-2", className)}>
  <Button
    variant="ghost"
    onclick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {title}
    <ArrowUpDown class="ml-2 h-4 w-4" />
  </Button>
</div>
