<script lang="ts">
	import DataTable from './data-table.svelte';
	import { columns } from './columns';

	let { data } = $props();
</script>

<div class="m-5">
	<DataTable data={data.items} {columns} />
</div>
