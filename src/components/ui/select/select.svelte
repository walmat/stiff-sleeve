<script>
	import { Select as SelectPrimitive } from "bits-ui";

	export let selected = undefined;
	export let open = undefined;
</script>

<SelectPrimitive.Root bind:selected bind:open {...$$restProps}>
	<slot />
</SelectPrimitive.Root>